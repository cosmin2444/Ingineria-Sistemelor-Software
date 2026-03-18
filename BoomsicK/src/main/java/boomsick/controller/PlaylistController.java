package boomsick.controller;

import boomsick.domain.Playlist;
import boomsick.service.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {
    @Autowired
    private PlaylistService playlistService;


    @PostMapping
    public Playlist create(@RequestParam String name, @RequestParam Long userId) {
        return playlistService.createPlaylist(name,userId);
    }


    @GetMapping("/user/{userId}")
    public List<Playlist> getByUser(@PathVariable Long userId) {
        return playlistService.findByOwnerId(userId);
    }

    @PostMapping("/add-track")
    public ResponseEntity<Playlist> addTrack(
            @RequestParam Long playlistId,
            @RequestParam Long trackId
    ) {
        return ResponseEntity.ok(playlistService.addTrackToPlaylist(playlistId, trackId));
    }
}
