package boomsick.service;

import boomsick.domain.Track;
import boomsick.repository.TrackRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrackService {
    private final TrackRepository trackRepository;
    public TrackService(TrackRepository trackRepository) {
        this.trackRepository = trackRepository;
    }

    public List<Track> getAllTracks(){
        return trackRepository.findAll();
    }

    public Track save(Track track){
        return trackRepository.save(track);
    }


}
