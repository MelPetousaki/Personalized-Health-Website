/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import database.tables.EditDoctorTable;
import database.tables.EditSimpleUserTable;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import mainClasses.Doctor;
import mainClasses.SimpleUser;

/**
 *
 * @author Vasilis Mavrogeorgis
 */
@WebServlet(name = "EditUser", urlPatterns = {"/EditUser"})
public class EditUser extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet EditUser</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet EditUser at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    public String getJSONFromAjax(BufferedReader reader) throws IOException {
        StringBuilder buffer = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            buffer.append(line);
        }
        String data = buffer.toString();
        return data;
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession();

        EditSimpleUserTable esu = new EditSimpleUserTable();
        EditDoctorTable edt = new EditDoctorTable();
        SimpleUser su;
        Doctor doc;
        String JsonString;

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {

            if (session.getAttribute("type") == "doctor") {
                String req = getJSONFromAjax(request.getReader()).replace("\"user_id\"", "\"doctor_id\"");
                doc = edt.jsonToDoctor(req);
                JsonString = edt.doctorToJSON(doc);
                if ((esu.databaseToSimpleEmail(doc.getEmail()) != null) || (edt.databaseToEditEmail(doc.getEmail(), doc.getDoctor_id()) != null)) {
                    response.setStatus(403);
                    Gson gson = new Gson();
                    JsonObject jo = new JsonObject();
                    jo.addProperty("error", "Email Already in Use");
                    response.getWriter().write(jo.toString());
                } else {
                    edt.updateDoctor(doc);
                    response.setStatus(200);
                    response.getWriter().write(JsonString);
                }

            } else {
                su = esu.jsonToSimpleUser(getJSONFromAjax(request.getReader()));
                JsonString = esu.simpleUserToJSON(su);
                if ((esu.databaseToEditEmail(su.getEmail(), su.getUser_id()) != null) || (edt.databaseToDoctorEmail(su.getEmail()) != null)) {
                    response.setStatus(403);
                    Gson gson = new Gson();
                    JsonObject jo = new JsonObject();
                    jo.addProperty("error", "Email Already in Use");
                    response.getWriter().write(jo.toString());
                } else {
                    esu.updateSimpleUser(su);
                    response.setStatus(200);
                    response.getWriter().write(JsonString);
                }
            }
        } catch (SQLException ex) {
            Logger.getLogger(EditUser.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(EditUser.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
