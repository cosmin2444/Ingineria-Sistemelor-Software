package boomsick.controller;

import boomsick.domain.Track;
import boomsick.domain.UserTrackPlay;
import boomsick.repository.ArtistPlayCountProjection;
import boomsick.service.TrackService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracks")
public class TrackController {
    private final TrackService trackService;
    public TrackController(TrackService trackService) {
        this.trackService = trackService;
    }

    @GetMapping
    public List<Track> getTracks(){
        return trackService.getAllTracks();
    }

    @PostMapping
    public Track addTrack(@RequestBody Track track){
        return trackService.save(track);
    }

    @PostMapping("/{id}/play")
    public UserTrackPlay incrementPlay(@PathVariable Long id, @RequestParam Long userId) {
        return trackService.incrementPlayCount(id, userId);
    }

    @GetMapping("/top-played")
    public List<UserTrackPlay> getTopPlayed(@RequestParam Long userId) {
        return trackService.getTopPlayedTracks(userId, 10);
    }

    @GetMapping("/top-artists")
    public List<ArtistPlayCountProjection> getTopArtists(@RequestParam Long userId) {
        return trackService.getTopPlayedArtists(userId, 10);
    }
}
