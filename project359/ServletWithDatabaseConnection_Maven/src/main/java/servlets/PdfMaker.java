/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import database.tables.EditRandevouzTable;
import database.tables.EditSimpleUserTable;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import mainClasses.Randevouz;
import mainClasses.SimpleUser;

/**
 *
 * @author Vasilis Mavrogeorgis
 */
public class PdfMaker extends HttpServlet {

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
            out.println("<title>Servlet PdfMaker</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet PdfMaker at " + request.getContextPath() + "</h1>");
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

        try {
            if ((!request.getParameterMap().containsKey("doctor_id")) || (!request.getParameterMap().containsKey("date"))) {
                response.setStatus(400);
                response.setContentType("application/json");
                JsonObject jo = new JsonObject();
                jo.addProperty("error", "Needs parameters doctor_id and date");
                response.getWriter().write(jo.toString());
            } else {

                int doctor_id = Integer.parseInt(request.getParameter("doctor_id"));
                String date = request.getParameter("date");

                EditRandevouzTable ert = new EditRandevouzTable();
                ArrayList<Randevouz> randevouz = ert.databaseRandvzToday(doctor_id, date);//here incoplete
                if (randevouz.isEmpty()) {
                    System.out.println("fuck");
                    response.setContentType("application/json");

                    response.setStatus(404);
                    JsonObject jo = new JsonObject();
                    jo.addProperty("error", "No Randevouz today");
                    response.getWriter().write(jo.toString());
                } else {
                    System.out.println(randevouz.size());
                    response.setContentType("application/pdf");

                    Document document = new Document();
                    PdfWriter.getInstance(document, response.getOutputStream());
                    document.open();
                    EditSimpleUserTable esut = new EditSimpleUserTable();
                    SimpleUser su;
                    Randevouz rvz;
                    Paragraph p = new Paragraph(date + "\n\n");
                    p.setAlignment(Element.ALIGN_CENTER);
                    document.add(p);
                    for (int i = 0; i < randevouz.size(); i++) {
                        rvz = randevouz.get(i);
                        String paragraph = "";

                        if ("cancelled".equals(rvz.getStatus())) {
                            continue;
                        }
                        if ("free".equals(rvz.getStatus())) {
                            paragraph += rvz.getDate_time().substring(11) + " : free\nYour Notes: " + rvz.getDoctor_info() + "\n\n";
                        } else {
                            su = esut.databaseToSimpleId(rvz.getUser_id());
                            System.out.println("\n\n\nthis is " + randevouz.get(i).getStatus() + "\n\n\n");
                            paragraph += rvz.getDate_time().substring(11) + " : " + rvz.getStatus()
                                    + "\nPatient            : " + su.getFirstname() + " " + su.getLastname() + "\nPhone             : " + su.getTelephone()
                                    + "\nYour Notes     : " + rvz.getDoctor_info()
                                    + "\nPatient Notes : " + rvz.getUser_info() + "\n\n";
                        }
                        if (!"".equals(paragraph)) {
                            document.add(new Paragraph(paragraph));
                        }
                    }

                    document.close();

                    processRequest(request, response);
                }
            }
        } catch (DocumentException | SQLException | ClassNotFoundException ex) {
            Logger.getLogger(PdfMaker.class.getName()).log(Level.SEVERE, null, ex);
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
        processRequest(request, response);
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
