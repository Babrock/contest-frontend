package model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Table(name = "counties")

public class County {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_county;
    private String name;
    private String id_voivodeship;
}
