import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Track} from './track.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  likeTrack(userId: number, trackId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/like/${trackId}`, {});
  }

  unlikeTrack(userId: number, trackId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/like/${trackId}`);
  }

  getLikedTracks(userId: number): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.apiUrl}/${userId}/liked-tracks`);
  }
}
