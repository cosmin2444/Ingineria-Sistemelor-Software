import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Track, TrackService, ArtistPlayCount} from '../../services/track.service'
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

import {PlaylistService} from '../../services/playlist.service';
import {UserService} from '../../services/user.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})

export class LibraryComponent implements OnInit {
  tracks: Track[] = [];
  playlists: any[]=[];
  selectedPlaylist: any = null;
  newPlaylistName: string = '';
  searchTerm: string = '';
  currentTrack: Track | null = null;
  activeDropdownTrackId: number | null = null;
  isAddTrackModalOpen: boolean = false;
  showingLikedSongs: boolean = false;
  showingStats: boolean = false;
  topTracks: Track[] = [];
  topArtists: ArtistPlayCount[] = [];
  likedTrackIds: Set<number> = new Set<number>();
  playQueue: Track[] = [];
  isQueueDrawerOpen: boolean = false;
  newTrack: Track = {
    title: '',
    artist: '',
    url: ''
  };
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  isPlaying: boolean = false;

  currentTime: number = 0;
  duration: number = 0;

  constructor(
    private trackService: TrackService,
    private playlistService: PlaylistService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Library initialized. Checking for user...');
    this.loadTracks();
    this.loadPlaylists();
    this.loadLikedTrackIds();
  }

  loadTracks() {
    this.trackService.getTracks().subscribe({
      next: (data) => {
        this.tracks = data

        this.cdr.detectChanges()
      },
      error: (err) => console.error('Eroare la piese:',err)
    });
  }

  onCreatePlaylist() {
    if (!this.newPlaylistName) {
      alert('Te rog introdu un nume!');
      return;
    }

    const userId = this.getCurrentUserId(); // LUĂM ID-UL REAL AICI

    this.playlistService.createPlaylist(this.newPlaylistName, userId).subscribe({
      next: (res) => {
        alert('Playlist created: ' + res.name);
        this.newPlaylistName = ''; // Resetăm input-ul
        this.loadPlaylists();      // REÎNCĂRCĂM lista imediat să apară noua bombă 💣
      },
      error: (err) => console.error(err)
    });
  }

  getCurrentUserId(): number{
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      return user.id;
    }
    return 0; //redirectioneaza la login daca nu
  }

  loadPlaylists(){
    const id = this.getCurrentUserId();
    console.log('Attempting to load playlists for User ID:', id); // Check your console!

    if (id !== 0) {
      this.playlistService.getUserPlaylists(id).subscribe({
        next: (data) => {
          this.playlists = data;
          console.log('Playlists loaded instantly:', data);

          if (this.selectedPlaylist) {
            const updated = this.playlists.find(p => p.id === this.selectedPlaylist.id);
            if (updated) {
              this.selectedPlaylist = updated;
              this.tracks = updated.tracks || [];
            } else {
              this.resetView();
            }
          }

          this.cdr.detectChanges();
        },
        error: (err) => console.error('Eroare la playlist-uri:', err)
      });
    } else {
      console.warn('No user ID found in localStorage yet.');
    }
  }

  onAddTrackToPlaylist(playlistId: number, trackId: number | undefined){
    if(!trackId){
      console.error('ID-ul piesei lipsește!');
      return;
    }

    this.playlistService.addTrackToPlaylist(playlistId,trackId).subscribe({
      next: (res) =>{
        console.log('Piesă adăugată cu succes:',res);
        alert('Piesa a fost adăugată în playlist!');
        this.loadPlaylists();
      },
      error:(err)=>{
        console.error('Eroare la adăugare:',err);
        alert('Ups! Ceva n-a mers la legarea piesei.')
      }
    });
  }

  onDeletePlaylist(event: Event, playlistId: number) {
    event.stopPropagation(); // Previne selectarea playlistului la click pe stergere
    if (confirm('Sigur vrei să ștergi acest playlist?')) {
      this.playlistService.deletePlaylist(playlistId).subscribe({
        next: () => {
          console.log('Playlist șters cu succes:', playlistId);
          this.loadPlaylists();
        },
        error: (err) => {
          console.error('Eroare la ștergerea playlistului:', err);
          alert('Ups! Nu am putut șterge playlistul.');
        }
      });
    }
  }

  onRemoveTrackFromPlaylist(playlistId: number, trackId: number | undefined) {
    if (!trackId) {
      console.error('ID-ul piesei lipsește!');
      return;
    }

    this.playlistService.removeTrackFromPlaylist(playlistId, trackId).subscribe({
      next: (res) => {
        console.log('Piesă eliminată cu succes:', res);
        this.loadPlaylists();
      },
      error: (err) => {
        console.error('Eroare la eliminare:', err);
        alert('Ups! Ceva n-a mers la eliminarea piesei.');
      }
    });
  }

  onSelectPlaylist(playlist: any){
    this.selectedPlaylist = playlist;
    this.showingLikedSongs = false;
    this.showingStats = false;
    console.log('Playlist selectat:',playlist.name);

    if(playlist.tracks){
      this.tracks = playlist.tracks;
    }
  }

  resetView(){
    this.selectedPlaylist = null;
    this.loadTracks();
  }

  get filteredTracks(){
    return this.tracks.filter(track=>
      track.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      track.artist.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  playNext() {
    if (!this.currentTrack || this.playQueue.length === 0) return;
    const currentIndex = this.playQueue.findIndex(t => t.id === this.currentTrack?.id);
    if (currentIndex !== -1 && currentIndex < this.playQueue.length - 1) {
      this.playTrack(this.playQueue[currentIndex + 1], false);
    }
  }

  playPrevious() {
    if (!this.currentTrack || this.playQueue.length === 0) return;
    const currentIndex = this.playQueue.findIndex(t => t.id === this.currentTrack?.id);
    if (currentIndex > 0) {
      this.playTrack(this.playQueue[currentIndex - 1], false);
    }
  }

  playTrack(track: Track, updateQueue: boolean = true) {
    this.currentTrack = track;
    this.isPlaying = true;
    console.log('Now playing:', track.title);

    if (updateQueue) {
      this.playQueue = [...this.filteredTracks];
    } else if (!this.playQueue.some(t => t.id === track.id)) {
      this.playQueue = [...this.filteredTracks];
    }

    const userId = this.getCurrentUserId();
    if (track.id && userId !== 0) {
      this.trackService.incrementPlayCount(track.id, userId).subscribe({
        next: (res) => {
          console.log('Play count incremented:', res.track.title, res.playCount);
          if (this.showingStats) {
            this.loadStatsDashboard();
          }
        },
        error: (err) => console.error('Failed to increment play count:', err)
      });
    }

    setTimeout(()=>{
      this.audioPlayer.nativeElement.load();
      this.audioPlayer.nativeElement.play();
    },50)
  }

  togglePlay(){
    if(!this.currentTrack) return;

    if(this.isPlaying){
      this.audioPlayer.nativeElement.pause();
    } else{
      this.audioPlayer.nativeElement.play();
    }

    this.isPlaying = !this.isPlaying;
  }

  onTimeUpdate(){
    const audio = this.audioPlayer.nativeElement;
    this.currentTime = audio.currentTime;
    this.duration = audio.duration || 0;
    const progress = (this.currentTime / this.duration) * 100;
    document.documentElement.style.setProperty('--progress', `${progress}%`);
  }

  onSeek(event: any){
    const audio = this.audioPlayer.nativeElement;
    audio.currentTime = event.target.value;
  }

  formatTime(time: number): string{
    if(!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  onVolumeRocker(volume: number){
    const normalizedVolume = volume / 100;
    if(normalizedVolume >= 0 && normalizedVolume <= 1){
      this.audioPlayer.nativeElement.volume = normalizedVolume;
    }

  }

  toggleDropdown(trackId: number | undefined) {
    if (!trackId) return;
    if (this.activeDropdownTrackId === trackId) {
      this.activeDropdownTrackId = null;
    } else {
      this.activeDropdownTrackId = trackId;
    }
  }

  openAddTrackModal() {
    this.isAddTrackModalOpen = true;
  }

  closeAddTrackModal() {
    this.isAddTrackModalOpen = false;
    this.newTrack = {
      title: '',
      artist: '',
      url: ''
    };
  }

  onAddTrack() {
    if (!this.newTrack.title || !this.newTrack.artist || !this.newTrack.url) {
      alert('Vă rugăm să completați toate câmpurile!');
      return;
    }

    this.trackService.createTrack(this.newTrack).subscribe({
      next: (track) => {
        console.log('Piesă adăugată cu succes:', track);
        alert('Piesa a fost adăugată în baza de date!');
        this.closeAddTrackModal();
        this.loadTracks(); // Reîncărcăm lista de piese
      },
      error: (err) => {
        console.error('Eroare la adăugarea piesei:', err);
        alert('Ups! Nu am putut adăuga piesa.');
      }
    });
  }

  loadLikedTrackIds() {
    const userId = this.getCurrentUserId();
    if (userId !== 0) {
      this.userService.getLikedTracks(userId).subscribe({
        next: (tracks) => {
          this.likedTrackIds = new Set(tracks.map(t => t.id!).filter(id => id !== undefined));
          if (this.showingLikedSongs) {
            this.tracks = tracks;
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Eroare la încărcarea pieselor apreciate:', err)
      });
    }
  }

  showAllTracks() {
    this.showingLikedSongs = false;
    this.showingStats = false;
    this.selectedPlaylist = null;
    this.loadTracks();
  }

  showLikedSongs() {
    this.showingLikedSongs = true;
    this.showingStats = false;
    this.selectedPlaylist = null;
    const userId = this.getCurrentUserId();
    if (userId !== 0) {
      this.userService.getLikedTracks(userId).subscribe({
        next: (tracks) => {
          this.tracks = tracks;
          this.likedTrackIds = new Set(tracks.map(t => t.id!).filter(id => id !== undefined));
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Eroare la încărcarea pieselor apreciate:', err)
      });
    }
  }

  isLiked(trackId: number | undefined): boolean {
    return trackId ? this.likedTrackIds.has(trackId) : false;
  }

  toggleLikeTrack(track: Track) {
    const userId = this.getCurrentUserId();
    if (userId === 0) {
      alert('Vă rugăm să vă autentificați!');
      return;
    }
    const trackId = track.id;
    if (!trackId) return;

    if (this.isLiked(trackId)) {
      this.userService.unlikeTrack(userId, trackId).subscribe({
        next: () => {
          this.likedTrackIds.delete(trackId);
          if (this.showingLikedSongs) {
            this.showLikedSongs(); // Reîncărcăm lista de piese apreciate
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Eroare la de-apreciere:', err)
      });
    } else {
      this.userService.likeTrack(userId, trackId).subscribe({
        next: () => {
          this.likedTrackIds.add(trackId);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Eroare la apreciere:', err)
      });
    }
  }

  showStatsDashboard() {
    this.showingStats = true;
    this.showingLikedSongs = false;
    this.selectedPlaylist = null;
    this.loadStatsDashboard();
  }

  loadStatsDashboard() {
    const userId = this.getCurrentUserId();
    if (userId === 0) return;

    this.trackService.getTopPlayedTracks(userId).subscribe({
      next: (plays) => {
        this.topTracks = plays.map(p => {
          const track = p.track;
          track.playCount = p.playCount;
          return track;
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Eroare la încărcarea melodiilor de top:', err)
    });

    this.trackService.getTopPlayedArtists(userId).subscribe({
      next: (artists) => {
        this.topArtists = artists;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Eroare la încărcarea artiștilor de top:', err)
    });
  }

  toggleQueueDrawer() {
    this.isQueueDrawerOpen = !this.isQueueDrawerOpen;
  }

  addToQueue(track: Track) {
    this.playQueue.push(track);
    alert(`Piesa "${track.title}" a fost adăugată în coadă!`);
    this.cdr.detectChanges();
  }

  moveTrackUp(index: number) {
    if (index > 0) {
      const temp = this.playQueue[index];
      this.playQueue[index] = this.playQueue[index - 1];
      this.playQueue[index - 1] = temp;
      this.cdr.detectChanges();
    }
  }

  moveTrackDown(index: number) {
    if (index < this.playQueue.length - 1) {
      const temp = this.playQueue[index];
      this.playQueue[index] = this.playQueue[index + 1];
      this.playQueue[index + 1] = temp;
      this.cdr.detectChanges();
    }
  }

  removeTrackFromQueue(index: number) {
    const removedTrack = this.playQueue[index];
    this.playQueue.splice(index, 1);
    
    if (this.currentTrack?.id === removedTrack.id) {
      if (this.playQueue.length > 0) {
        const nextIndex = index < this.playQueue.length ? index : this.playQueue.length - 1;
        this.playTrack(this.playQueue[nextIndex], false);
      } else {
        this.currentTrack = null;
        this.isPlaying = false;
      }
    }
    this.cdr.detectChanges();
  }

  logout() {
    localStorage.removeItem('currentUser');
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      this.audioPlayer.nativeElement.pause();
    }
    this.currentTrack = null;
    this.isPlaying = false;
    this.playQueue = [];
    this.router.navigate(['/']);
  }
}
