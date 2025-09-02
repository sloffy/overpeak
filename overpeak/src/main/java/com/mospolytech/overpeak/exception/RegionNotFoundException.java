package com.mospolytech.overpeak.exception;

public class RegionNotFoundException extends RuntimeException{

    public RegionNotFoundException(String message) {
        super(message);
    }
}