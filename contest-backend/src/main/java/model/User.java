package model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import javax.persistence.*;

import static javax.persistence.CascadeType.ALL;

@Entity
@Getter
@Setter

@Table(name = "users")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @javax.persistence.Id
    private  long id;
    private String firstname;
    private String lastname;
    private String email;
    private String login;
    private String password;
    private String id_rate;
    private String id_school;
    private String id_proffestional_title;
    private String id_role;

//    @JsonManagedReference
//    @OneToMany(cascade = ALL, mappedBy = "user", fetch = FetchType.LAZY)
//    private List<Task> tasks;
}
