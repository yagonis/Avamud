package com.avamud.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AcessDto {
    private String token;
    private String username;
    private String role;
    
    public AcessDto(String token) {
        this.token = token;
    }
}
