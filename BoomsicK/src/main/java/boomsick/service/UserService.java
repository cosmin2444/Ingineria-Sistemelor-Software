package boomsick.service;

import boomsick.domain.User;
import boomsick.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user){
        return userRepository.save(user);
    }

    public Optional<User> login(String email, String password){
        return userRepository.findByEmail(email)
                .filter(user->user.getPassword().equals(password));
    }
}
