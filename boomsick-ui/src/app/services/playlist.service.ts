import {Injectable} from '@angular/core';
import {HttpClient,HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PlaylistService {
  private apiUrl = 'http://localhost:8080/api/playlists';

  constructor(private http: HttpClient) {}

  createPlaylist(name: string, userId: number): Observable<any>{
    const params = new HttpParams()
    .set('name', name)
      .set('userId', userId.toString());
    return this.http.post(this.apiUrl,{},{params});
  }

  addTrackToPlaylist(playlistId: number, trackId: number): Observable<any>{
    const params = new HttpParams()
      .set('playlistId', playlistId.toString())
      .set('trackId',trackId.toString());
    return this.http.post(`${this.apiUrl}/add-track`,{},{params});
  }

  getUserPlaylists(userId: number): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
}
