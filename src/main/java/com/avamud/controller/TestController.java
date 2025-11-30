package com.avamud.controller;

import com.avamud.entity.User;
import com.avamud.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/test")
public class TestController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @GetMapping("/check-password/{login}")
    public Map<String, Object> checkPassword(@PathVariable String login, @RequestParam String senha) {
        Map<String, Object> result = new HashMap<>();
        Optional<User> userOpt = userRepository.findByLogin(login);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            result.put("userFound", true);
            result.put("login", user.getLogin());
            result.put("passwordHash", user.getSenha());
            result.put("passwordLength", user.getSenha() != null ? user.getSenha().length() : 0);
            result.put("passwordMatches", passwordEncoder.matches(senha, user.getSenha()));
        } else {
            result.put("userFound", false);
        }
        
        return result;
    }
    
    @GetMapping("/hash-password")
    public Map<String, String> hashPassword(@RequestParam String senha) {
        Map<String, String> result = new HashMap<>();
        String hash = passwordEncoder.encode(senha);
        result.put("originalPassword", senha);
        result.put("hashedPassword", hash);
        result.put("hashLength", String.valueOf(hash.length()));
        return result;
    }
    
    @PostMapping("/fix-password/{login}")
    public Map<String, Object> fixPassword(@PathVariable String login, @RequestParam String senha) {
        Map<String, Object> result = new HashMap<>();
        Optional<User> userOpt = userRepository.findByLogin(login);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String hashedPassword = passwordEncoder.encode(senha);
            user.setSenha(hashedPassword);
            userRepository.save(user);
            
            result.put("success", true);
            result.put("login", user.getLogin());
            result.put("message", "Senha atualizada com sucesso");
            result.put("newHashLength", hashedPassword.length());
        } else {
            result.put("success", false);
            result.put("message", "Usuário não encontrado");
        }
        
        return result;
    }
}
