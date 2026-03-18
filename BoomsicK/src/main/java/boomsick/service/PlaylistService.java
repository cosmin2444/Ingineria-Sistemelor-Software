package boomsick.service;

import boomsick.domain.Playlist;
import boomsick.domain.Track;
import boomsick.domain.User;
import boomsick.repository.PlaylistRepository;
import boomsick.repository.TrackRepository;
import boomsick.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final TrackRepository trackRepository;
    private final UserRepository userRepository;

    public PlaylistService(PlaylistRepository playlistRepository, TrackRepository trackRepository, UserRepository userRepository) {
        this.playlistRepository = playlistRepository;
        this.trackRepository = trackRepository;
        this.userRepository = userRepository;
    }

    public Playlist createPlaylist(String name, Long userId){
        User owner = userRepository.findById(userId)
                .orElseThrow(()->new RuntimeException("User not found with ID: "+userId));
        Playlist playlist=new Playlist();
        playlist.setName(name);
        playlist.setOwner(owner);
        return playlistRepository.save(playlist);
    }

    public Playlist addTrackToPlaylist(Long playlistId, Long trackId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
        Track track = trackRepository.findById(trackId)
                .orElseThrow(() -> new RuntimeException("Track not found"));

        playlist.getTracks().add(track);

        return playlistRepository.save(playlist);
    }

    public List<Playlist> findByOwnerId(Long userId){
        return  playlistRepository.findByOwnerId(userId);
    }
}
