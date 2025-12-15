package com.example.rms.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;



@Table(name = "categories")
@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id") // esmo fe el database
    private int id;
    @Column(name = "category_name")
    private String name;
    @Column(name = "category_desc")
    private String description;

    public Category() {
    }

    private Category(Builder builder) {
        this.name = builder.name;
        this.description = builder.description;
    }

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public static class Builder {
        private String name;
        private String description;

        public Builder() {
        }

        public Builder name(String name) {
            this.name = name;
            return this; 
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Category build() {
            return new Category(this);
        }
    }


}

