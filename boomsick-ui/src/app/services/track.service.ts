import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Track{
  id?: number;
  title: string;
  artist: string;
  url: string;
  playCount?: number;
}

export interface ArtistPlayCount {
  artist: string;
  playCount: number;
}

@Injectable({
  providedIn: 'root'
})

export class TrackService {
  private apiUrl = 'http://localhost:8080/api/tracks';

  constructor(private http:HttpClient){

  }

  getTracks(): Observable<Track[]>{
    return this.http.get<Track[]>(this.apiUrl);
  }

  createTrack(track: Track): Observable<Track>{
    return this.http.post<Track>(this.apiUrl, track);
  }

  incrementPlayCount(trackId: number, userId: number): Observable<any>{
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.post<any>(`${this.apiUrl}/${trackId}/play`, {}, {params});
  }

  getTopPlayedTracks(userId: number): Observable<any[]>{
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<any[]>(`${this.apiUrl}/top-played`, {params});
  }

  getTopPlayedArtists(userId: number): Observable<ArtistPlayCount[]>{
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<ArtistPlayCount[]>(`${this.apiUrl}/top-artists`, {params});
  }
}
