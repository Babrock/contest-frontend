package com.example.contestbackend.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Integer idUser;
    private String firstname;
    private String lastname;
    private String email;
    private String login;
    private String password;
    private Boolean isRating;
//    private String school;

    @ManyToOne
    @JoinColumn(name = "id_title")
    private Title title;
//    private String role;
}
