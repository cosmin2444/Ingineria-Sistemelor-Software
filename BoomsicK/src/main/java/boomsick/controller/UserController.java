package boomsick.controller;

import boomsick.domain.LoginRequest;
import boomsick.domain.User;
import boomsick.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins="http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user){
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){
        Optional<User> user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get()); // Returnează obiectul User (JSON)
        } else {
            return ResponseEntity.status(401).body("Email sau parolă greșită!"); // Returnează un String
        }
    }
}
