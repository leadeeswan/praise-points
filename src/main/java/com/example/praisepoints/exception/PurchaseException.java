package com.example.praisepoints.exception;

public class PurchaseException extends RuntimeException {
    private final String errorCode;
    
    public PurchaseException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
}