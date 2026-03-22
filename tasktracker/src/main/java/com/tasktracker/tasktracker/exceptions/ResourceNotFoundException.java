package com.tasktracker.tasktracker.exceptions;

public class ResourceNotFoundException extends RuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = -1240352512167878695L;

	public ResourceNotFoundException(String message) {
        super(message);
    }
}
