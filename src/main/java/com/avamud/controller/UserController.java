package com.avamud.controller;

import com.avamud.service.UserService;
import com.avamud.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired // ingetando
    private UserService userService;

    @GetMapping
    public List<UserDto> getAllUser() {   // Lista todos os usuarios
        return userService.getAllUser();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserPeloId(@PathVariable Long id) { // Buscar Usuario pelo ID
        UserDto userDto = userService.getUserPeloId(id);
        if (userDto != null) {
            return ResponseEntity.ok(userDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<UserDto> criarUser(@RequestBody UserDto userDto) { //Criar Usuario
        UserDto criarUser = userService.criarUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criarUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> atualizarUser(@PathVariable Long id, @RequestBody UserDto userDto) { //Atualizar um usuario
        UserDto atualizarUser = userService.atualizarUser(id, userDto);
        if (atualizarUser != null) {
            return ResponseEntity.ok(atualizarUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserDto> apagarUser(@PathVariable Long id) {
        if (userService.deletarUser(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}
