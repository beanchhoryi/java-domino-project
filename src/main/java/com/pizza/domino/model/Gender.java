package com.pizza.domino.model;

public enum Gender {
    MALE,
    FEMALE,
    OTHER;

    public static Gender fromString(String value) {
        if (value == null) return OTHER;
        switch (value.toLowerCase()) {
            case "male": return MALE;
            case "female": return FEMALE;
            default: return OTHER;
        }
    }
}
