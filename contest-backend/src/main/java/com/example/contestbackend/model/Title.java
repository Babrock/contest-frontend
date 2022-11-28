package com.example.contestbackend.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Setter
@Getter
@Table(name = "titles")
public class Title {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTitle;
    private String titleName;
}
