package boomsick;

import boomsick.domain.Track;
import boomsick.repository.TrackRepository;
import boomsick.service.TrackService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BoomsicKApplication {

    public static void main(String[] args) {
        System.out.println("BoomsicK Application Started");
        SpringApplication.run(BoomsicKApplication.class, args);
    }

    @Bean
    CommandLineRunner start(TrackRepository trackRepository, TrackService trackService) {
        return args-> {
//            trackService.save(new Track(null,"AC/DC","Back in Black"));
//            System.out.println(trackRepository.findAll());
        };
    }

}
