package boomsick.service;

import boomsick.domain.User;
import boomsick.repository.UserRepository;

public class AuthService {
    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User user) {
        if(user.getRole() == null){
            user.setRole("ROLE_USER");
        }
        return userRepository.save(user);
    }

    public boolean login(String username, String password) {
        return userRepository.findByUsername(username)
                .map(user->user.getPassword().equals(password))
                .orElse(false);
    }
}
