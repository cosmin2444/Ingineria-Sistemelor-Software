package boomsick.controller;

import boomsick.domain.Track;
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
}
