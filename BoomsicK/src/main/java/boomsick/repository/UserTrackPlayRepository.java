package boomsick.repository;

import boomsick.domain.UserTrackPlay;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserTrackPlayRepository extends JpaRepository<UserTrackPlay, Long> {
    Optional<UserTrackPlay> findByUserIdAndTrackId(Long userId, Long trackId);

    @Query("SELECT utp FROM UserTrackPlay utp WHERE utp.user.id = :userId ORDER BY utp.playCount DESC")
    List<UserTrackPlay> findTopPlayedTracks(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT utp.track.artist AS artist, SUM(utp.playCount) AS playCount FROM UserTrackPlay utp WHERE utp.user.id = :userId GROUP BY utp.track.artist ORDER BY SUM(utp.playCount) DESC")
    List<ArtistPlayCountProjection> findTopArtists(@Param("userId") Long userId, Pageable pageable);
}
