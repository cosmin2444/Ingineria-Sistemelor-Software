import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Track{
  id?: number;
  title: string;
  artist: string;
  url: string;
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
}
