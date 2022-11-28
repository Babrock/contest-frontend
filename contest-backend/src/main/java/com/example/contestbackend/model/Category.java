package com.example.contestbackend.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Setter
@Getter
@Table(name = "categories")

public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCategory;
    private String categoryName;
}
