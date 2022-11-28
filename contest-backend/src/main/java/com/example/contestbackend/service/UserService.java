package com.example.contestbackend.service;

import com.example.contestbackend.repository.UserRepository;
import com.example.contestbackend.dto.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserRepositoryImpl {
    private final UserRepository userRepository;
    public List<UserResponse> getUsers() {
        return userRepository.findAllProjectedBy();
    }
    public UserResponse getSingleUser(int id) {
        return userRepository.findById(id, UserResponse.class);
    }
}
