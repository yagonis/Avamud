package com.avamud.service;

import com.avamud.dto.AcessDto;
import com.avamud.dto.AuthDto;
import com.avamud.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
   private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    public AcessDto login(AuthDto authDto) {
        try {
            UsernamePasswordAuthenticationToken userAuth = new UsernamePasswordAuthenticationToken(authDto.getUsername(), authDto.getPassword());
            Authentication authentication = authenticationManager.authenticate(userAuth);

            // Aqui você já está fazendo o cast para UserDetailImpl, o que está correto
            UserDetailImpl userAuthenticate = (UserDetailImpl) authentication.getPrincipal();

            String token = jwtUtils.generateTokenFromUserDetailsImpl(userAuthenticate);
            
            // Determinar o papel baseado no username
            String role = determineRole(userAuthenticate.getUsername());
            
            AcessDto acessDto = new AcessDto();
            acessDto.setToken(token);
            acessDto.setUsername(userAuthenticate.getUsername());
            acessDto.setRole(role);
            
            return acessDto;
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Bad credentials");
        }
    }
    
    private String determineRole(String username) {
        if (username == null) {
            return "membro";
        }
        
        switch (username.toLowerCase()) {
            case "admin":
                return "administrador";
            case "tesoureiro":
                return "tesoureiro";
            default:
                return "membro";
        }
    }
}
