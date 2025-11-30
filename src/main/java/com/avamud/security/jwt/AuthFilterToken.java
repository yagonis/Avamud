package com.avamud.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class AuthFilterToken extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try{
            String jwt = getToken(request);
            System.out.println("[AuthFilterToken] incoming request to: " + request.getRequestURI());
            if (jwt == null) {
                System.out.println("[AuthFilterToken] no Authorization header with Bearer token found");
            } else {
                System.out.println("[AuthFilterToken] token found (prefix): " + (jwt.length() > 20 ? jwt.substring(0,20) + "..." : jwt));
            }
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                System.out.println("[AuthFilterToken] token validated OK");
                String username = jwtUtils.getUsernameFromToken(jwt);
                System.out.println("[AuthFilterToken] username extracted from token: " + username);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (userDetails == null) {
                    System.out.println("[AuthFilterToken] userDetailsService returned null for username: " + username);
                } else {
                    System.out.println("[AuthFilterToken] userDetails loaded: " + userDetails.getUsername());
                }
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("[AuthFilterToken] authentication set in SecurityContext");
            }

        }catch (Exception e) {
            System.out.println("Erro ao processar o token : " + e.getMessage());
        }finally {
            filterChain.doFilter(request, response);
        }

    }
    private String getToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }else {
            return null;
        }
    }
}
