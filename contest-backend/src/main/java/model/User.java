package model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Table(name = "users")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  long user_id;
    private String firstname;
    private String lastname;
    private String email;
    private String password;

    @JsonManagedReference
    @OneToMany(cascade = All, mappedBy = "user", fetch = FetchType.LAZY)
    private List<>
}
