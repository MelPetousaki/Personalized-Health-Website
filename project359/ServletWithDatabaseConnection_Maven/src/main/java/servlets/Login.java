/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import database.tables.EditDoctorTable;
import database.tables.EditSimpleUserTable;
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
@WebServlet(name = "Login", urlPatterns = {"/Login"})
public class Login extends HttpServlet {

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
            out.println("<title>Servlet Login</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet Login at " + request.getContextPath() + "</h1>");
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
        HttpSession session = request.getSession();

        try (PrintWriter out = response.getWriter()) {
            if (session.getAttribute("loggedIn") != null) {

                if (session.getAttribute("type") == "admin") {
                    response.setStatus(200);
                    EditSimpleUserTable eut = new EditSimpleUserTable();
                    SimpleUser su = eut.databaseToSimpleUsername(session.getAttribute("loggedIn").toString());
                    String json = eut.simpleUserToJSON(su);
                    json = json.substring(0, json.length() - 1);
                    json += ",\"admin\":\"admin\"}";
                    out.println(json);
                } else if (session.getAttribute("type") == "user") {
                    response.setStatus(200);
                    EditSimpleUserTable eut = new EditSimpleUserTable();
                    SimpleUser su = eut.databaseToSimpleUsername(session.getAttribute("loggedIn").toString());
                    String json = eut.simpleUserToJSON(su);
                    out.println(json);
                } else if (session.getAttribute("type") == "doctor") {
                    response.setStatus(200);
                    EditDoctorTable edt = new EditDoctorTable();
                    Doctor doc = edt.databaseToDoctorUser(session.getAttribute("loggedIn").toString());
                    String json = edt.doctorToJSON(doc);
                    out.println(json);
                }//for doctor/admin
                else//there used to be a user, but cant find him?
                {
                    response.setStatus(404);
                    JsonObject jo = new JsonObject();
                    jo.addProperty("error", "no idea");
                    response.getWriter().write(jo.toString());
                }
            } else {
                response.setStatus(403);
                JsonObject jo = new JsonObject();
                jo.addProperty("error", "It appears you are not logged in");
                response.getWriter().write(jo.toString());
            }
        } catch (SQLException ex) {
            Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, ex);
        }
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
        response.setContentType("text/html;charset=UTF-8");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        HttpSession session = request.getSession(true);

        try (PrintWriter out = response.getWriter()) {
            EditSimpleUserTable eut = new EditSimpleUserTable();
            SimpleUser su = eut.databaseToSimpleUser(username, password);
            if (su == null) {
                EditDoctorTable edt = new EditDoctorTable();
                Doctor doc = edt.databaseToDoctorLogin(username, password);
                if (doc == null) {
                    response.setStatus(403); //no combination of username-password found
                    Gson gson = new Gson();
                    JsonObject jo = new JsonObject();
                    jo.addProperty("error", "No account corresponds to the input username-password");
                    response.getWriter().write(jo.toString());
                } else {

                    if (doc.getCertified() == 0) {
                        response.setStatus(403); //no combination of username-password found
                        Gson gson = new Gson();
                        JsonObject jo = new JsonObject();
                        jo.addProperty("error", "Doctor not yet Certified");
                        response.getWriter().write(jo.toString());
                    } else {
                        String json = edt.doctorToJSON(doc);
                        out.println(json);
                        session.setAttribute("loggedIn", username);
                        session.setAttribute("type", "doctor");
                        response.setStatus(200);
                    }
                }

            } else {
                if ("admin".equals(su.getUsername())) {
                    String json = eut.simpleUserToJSON(su);
                    json = json.substring(0, json.length() - 1);
                    json += ",\"admin\":\"admin\"}";
                    out.println(json);
                    session.setAttribute("loggedIn", username);
                    session.setAttribute("type", "admin");
                    response.setStatus(200);
                } else {
                    String json = eut.simpleUserToJSON(su);
                    out.println(json);
                    session.setAttribute("loggedIn", username);
                    session.setAttribute("type", "user");
                    response.setStatus(200);
                }
            }
        } catch (SQLException ex) {
            Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(Login.class.getName()).log(Level.SEVERE, null, ex);
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
