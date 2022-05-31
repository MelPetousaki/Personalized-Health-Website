/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package rest;

/**
 *
 * @author Vasilis Mavrogeorgis
 */
public class IncompleteMsg {

    String message, sender;
    int user_id, doctor_id;

    public void setMessage(String message) {
        this.message = message;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public void setUser(int user_id) {
        this.user_id = user_id;
    }

    public void setDoctor(int doctor_id) {
        this.doctor_id = doctor_id;
    }

    public String getMessage() {
        return message;
    }

    public String getSender() {
        return sender;
    }

    public int getUser() {
        return user_id;
    }

    public int getDoctor() {
        return doctor_id;
    }
}
