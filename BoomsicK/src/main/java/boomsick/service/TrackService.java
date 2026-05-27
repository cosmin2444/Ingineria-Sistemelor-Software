package boomsick.service;

import boomsick.domain.Track;
import boomsick.domain.User;
import boomsick.domain.UserTrackPlay;
import boomsick.repository.TrackRepository;
import boomsick.repository.UserRepository;
import boomsick.repository.UserTrackPlayRepository;
import boomsick.repository.ArtistPlayCountProjection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrackService {
    private final TrackRepository trackRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserTrackPlayRepository userTrackPlayRepository;

    public TrackService(TrackRepository trackRepository) {
        this.trackRepository = trackRepository;
    }

    public List<Track> getAllTracks(){
        return trackRepository.findAll();
    }

    public Track save(Track track){
        return trackRepository.save(track);
    }

    public UserTrackPlay incrementPlayCount(Long trackId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new RuntimeException("Track not found with ID: " + trackId));

        UserTrackPlay play = userTrackPlayRepository.findByUserIdAndTrackId(userId, trackId)
                .orElseGet(() -> {
                    UserTrackPlay newPlay = new UserTrackPlay();
                    newPlay.setUser(user);
                    newPlay.setTrack(track);
                    newPlay.setPlayCount(0);
                    return newPlay;
                });

        play.setPlayCount(play.getPlayCount() + 1);
        return userTrackPlayRepository.save(play);
    }

    public List<UserTrackPlay> getTopPlayedTracks(Long userId, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return userTrackPlayRepository.findTopPlayedTracks(userId, pageable);
    }

    public List<ArtistPlayCountProjection> getTopPlayedArtists(Long userId, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return userTrackPlayRepository.findTopArtists(userId, pageable);
    }
}
