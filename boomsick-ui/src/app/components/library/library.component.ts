import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Track, TrackService} from '../../services/track.service'
import {HttpClient} from '@angular/common/http';

import {PlaylistService} from '../../services/playlist.service';
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
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  isPlaying: boolean = false;

  currentTime: number = 0;
  duration: number = 0;

  constructor(private trackService: TrackService, private playlistService: PlaylistService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('Library initialized. Checking for user...');
    this.loadTracks();
    this.loadPlaylists();
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

  onSelectPlaylist(playlist: any){
    this.selectedPlaylist = playlist;
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
    if (!this.currentTrack) return;
    const currentIndex = this.filteredTracks.findIndex(t => t.id === this.currentTrack?.id);
    if (currentIndex < this.filteredTracks.length - 1) {
      this.currentTrack = this.filteredTracks[currentIndex + 1];
    }
    this.playTrack(this.currentTrack);
  }

  playPrevious() {
    if (!this.currentTrack) return;
    const currentIndex = this.filteredTracks.findIndex(t => t.id === this.currentTrack?.id);
    if (currentIndex > 0) {
      this.currentTrack = this.filteredTracks[currentIndex - 1];
    }
    this.playTrack(this.currentTrack);
  }

  playTrack(track: Track) {
    this.currentTrack = track;
    this.isPlaying = true;
    console.log('Now playing:', track.title);

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
}
