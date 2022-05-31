/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rest;

import mainClasses.BloodTest;
import database.tables.EditBloodTestTable;
import database.tables.EditTreatmentTable;
import mainClasses.Treatment;
import com.google.gson.Gson;
import database.tables.EditDoctorTable;
import database.tables.EditMessageTable;
import database.tables.EditRandevouzTable;
import database.tables.EditSimpleUserTable;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import mainClasses.Doctor;
import mainClasses.Message;
import mainClasses.Randevouz;
import mainClasses.SimpleUser;

/**
 * REST Web Service
 *
 * @author mountant
 */
@Path("medical_db")
public class MedicalAPI {

    /**
     * Retrieves representation of an instance of restApi.GenericResource
     *
     * @param amka
     * @param fromDate
     * @param toDate
     * @return an instance of java.lang.String
     */
    @GET
    @Path("/bloodTests/{amka}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getPatient(@PathParam("amka") String amka,
            @QueryParam("fromDate") String fromDate, @QueryParam("toDate") String toDate) {

        EditBloodTestTable eblt = new EditBloodTestTable();
        ArrayList<BloodTest> bts = null;
        try {
            if (eblt.databaseToBloodTest(amka) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"No bloodtests match the AMKA given\"}").build();
            }

            if (fromDate != null && toDate != null) {
                int todayYear = Integer.parseInt(toDate.substring(0, 4));
                int todayMonth = Integer.parseInt(toDate.substring(5, 7));
                int todayDay = Integer.parseInt(toDate.substring(8));
                int dateYear = Integer.parseInt(fromDate.substring(0, 4));
                int dateMonth = Integer.parseInt(fromDate.substring(5, 7));
                int dateDay = Integer.parseInt(fromDate.substring(8));

                if (dateYear > todayYear) {
                    return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"fromDate cannot be after toDate\"}").build();
                }
                if ((dateYear == todayYear) && (dateMonth > todayMonth)) {
                    return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"fromDate cannot be after toDate\"}").build();
                }
                if ((dateYear == todayYear) && (dateMonth == todayMonth) && (dateDay > todayDay)) {
                    return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"fromDate cannot be after toDate\"}").build();
                }

                bts = eblt.databaseToBloodTests_FTDATES(amka, fromDate, toDate);
            } else if (fromDate != null) {
                bts = eblt.databaseToBloodTests_FDATES(amka, fromDate);
            } else if (toDate != null) {
                bts = eblt.databaseToBloodTests_TDATES(amka, toDate);
            } else {
                bts = eblt.databaseToBloodTests(amka);
            }

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }

        String json = new Gson().toJson(bts);
        return Response.status(Response.Status.OK).type("application/json").entity(json).build();
    }

    @GET
    @Path("/bloodTestMeasure/{amka}/{measure}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getMeasures(@PathParam("amka") String amka,
            @PathParam("measure") String measure) {
        EditBloodTestTable eblt = new EditBloodTestTable();
        ArrayList<BloodTest> bts = new ArrayList<>();
        try {
            if (eblt.databaseToBloodTest(amka) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"No bloodtests match the AMKA given\"}").build();
            }
            if ((!"blood_sugar".equals(measure)) && (!"cholesterol".equals(measure))
                    && (!"iron".equals(measure)) && (!"vitamin_d3".equals(measure)) && (!"vitamin_b12".equals(measure))) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"No measures are taken for what is asked\"}").build();
            }

            bts = eblt.databaseToBloodTests(amka);

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }
        ArrayList<Measures> ms = new ArrayList<>();
        for (int i = 0; i < bts.size(); i++) {
            ms.add(new Measures(bts.get(i), measure));
        }
        String json = new Gson().toJson(ms);
        return Response.status(Response.Status.OK).type("application/json").entity(json).build();
    }

    @POST
    @Path("/newBloodTest")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response addBloodtest(String bloodtest) throws SQLException {
        try {
            EditBloodTestTable eblt = new EditBloodTestTable();
            BloodTest bt = eblt.jsonToBloodTest(bloodtest);
            EditSimpleUserTable esut = new EditSimpleUserTable();

            if (esut.databaseToSimpleAmka(bt.getAmka()) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"couldn't find user in database\"}").build();
            }

            if (bt.getMedical_center() == null || bt.getTest_date() == null) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Amka, Medical Center, and Date must be given\"}").build();
            }

            if ((bt.getBlood_sugar() == 0) && (bt.getCholesterol() == 0) && (bt.getIron() == 0) && (bt.getVitamin_b12() == 0) && (bt.getVitamin_d3() == 0)) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"At least one measurment must be given\"}").build();
            }

            //conversion of localdate to string taken from stack overflow
            LocalDate date = java.time.LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            String today = date.format(formatter);
            int todayYear = Integer.parseInt(today.substring(6));
            int todayMonth = Integer.parseInt(today.substring(3, 5));
            int todayDay = Integer.parseInt(today.substring(0, 2));
            int dateYear = Integer.parseInt(bt.getTest_date().substring(0, 4));
            int dateMonth = Integer.parseInt(bt.getTest_date().substring(5, 7));
            int dateDay = Integer.parseInt(bt.getTest_date().substring(8));

            if ((bt.getBlood_sugar() < 0) || (bt.getCholesterol() < 0) || (bt.getIron() < 0) || (bt.getVitamin_b12() < 0) || (bt.getVitamin_d3() < 0)) {
                return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"Measurment cannot be negative numbers\"}").build();
            }

            if (dateYear > todayYear) {
                return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"It appears this date is years to the future\"}").build();
            }
            if ((dateYear == todayYear) && (dateMonth > todayMonth)) {
                return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"It appears this date is in a few months\"}").build();
            }
            if ((dateYear == todayYear) && (dateMonth == todayMonth) && (dateDay > todayDay)) {
                return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"It appears this date is in a few days\"}").build();
            }

            bt.setValues();

            eblt.createNewBloodTest(bt);
            return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\"Bloodtest Added\"}").build();

        } catch (ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).type("application/json").entity("{\"success\":\"Not Sure\"}").build();

    }

    @PUT
    @Path("/bloodTest/{bloodTestID}/{measure}/{value}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateMeasure(@PathParam("bloodTestID") int bloodTestID, @PathParam("measure") String measure,
            @PathParam("value") double value, @HeaderParam("Accept") String acceptHeader) {

        EditBloodTestTable eblt = new EditBloodTestTable();
        try {
            if (eblt.databaseToBloodTest_ID(bloodTestID) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"No Bloodtest has the input ID\"}").build();
            }
            if ((!"blood_sugar".equals(measure)) && (!"cholesterol".equals(measure))
                    && (!"iron".equals(measure)) && (!"vitamin_d3".equals(measure)) && (!"vitamin_b12".equals(measure))) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"No measures are taken for what is asked\"}").build();
            }
            if (value < 0) {
                return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"Measurment cannot be negative numbers\"}").build();
            }

            eblt.updateBloodTest(bloodTestID, measure, value);

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }

        return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\"" + measure + " Updated\"}").build();
    }

    @DELETE
    @Path("/bloodTestDeletion/{bloodTestID}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteBloodTest(@PathParam("bloodTestID") int bloodTestID) {
        try {
            EditBloodTestTable eblt = new EditBloodTestTable();

            if (eblt.databaseToBloodTest_ID(bloodTestID) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"No Bloodtest has the input ID\"}").build();
            }

            eblt.deleteBloodTest(bloodTestID);

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }

        return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\"Bloodtest Deleted\"}").build();
    }

    /**
     * Retrieves representation of an instance of restApi.GenericResource
     *
     * @param user_id
     * @param fromDate
     * @param toDate
     * @return an instance of java.lang.String
     */
    @GET
    @Path("/treatments/{user_id}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getTreatment(@PathParam("user_id") int user_id,
            @QueryParam("fromDate") String fromDate, @QueryParam("toDate") String toDate) {

        EditTreatmentTable ett = new EditTreatmentTable();
        ArrayList<Treatment> ts = null;
        try {
            if (ett.databaseToTreatmentUser(user_id) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"No treatment match the user given\"}").build();
            }

            if (fromDate != null && toDate != null) {
                int todayYear = Integer.parseInt(toDate.substring(0, 4));
                int todayMonth = Integer.parseInt(toDate.substring(5, 7));
                int todayDay = Integer.parseInt(toDate.substring(8));
                int dateYear = Integer.parseInt(fromDate.substring(0, 4));
                int dateMonth = Integer.parseInt(fromDate.substring(5, 7));
                int dateDay = Integer.parseInt(fromDate.substring(8));

                if (dateYear > todayYear) {
                    return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"fromDate cannot be after toDate\"}").build();
                }
                if ((dateYear == todayYear) && (dateMonth > todayMonth)) {
                    return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"fromDate cannot be after toDate\"}").build();
                }
                if ((dateYear == todayYear) && (dateMonth == todayMonth) && (dateDay > todayDay)) {
                    return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"fromDate cannot be after toDate\"}").build();
                }

                ts = ett.databaseToTreatments_FTDATES(user_id, fromDate, toDate);
            } else if (fromDate != null) {
                ts = ett.databaseToTreatments_ACTIVE(user_id, fromDate);
            } else if (toDate != null) {
                ts = ett.databaseToTreatments_DONE(user_id, toDate);
            } else {
                ts = ett.databaseToTreatments(user_id);
            }

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }

        String json = new Gson().toJson(ts);
        return Response.status(Response.Status.OK).type("application/json").entity(json).build();
    }

    @POST
    @Path("/newTreatment")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response addTreatment(String treatment) {
        try {
            EditTreatmentTable ett = new EditTreatmentTable();
            Treatment tr = ett.jsonToTreatment(treatment);

            //checks the validity of the input
            EditDoctorTable edtl = new EditDoctorTable();
            if (edtl.databaseToDoctorId(tr.getDoctor_id()) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"no Doctor exists with this id\"}").build();
            }

            EditSimpleUserTable esut = new EditSimpleUserTable();
            if (esut.databaseToSimpleId(tr.getUser_id()) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"no User exists with this id\"}").build();
            }

            EditBloodTestTable ebtt = new EditBloodTestTable();
            if (ebtt.databaseToBloodTest_ID(tr.getBloodtest_id()) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"no bloodtest exists with this id\"}").build();
            }

            if (tr.getStart_date() == null) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Treatment must have a start date\"}").build();
            }

            if (tr.getEnd_date() == null) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Treatment must have an end date\"}").build();
            }

            if ((tr.getTreatment_text() == null) || ("".equals(tr.getTreatment_text()))) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Treatment must have instructions\"}").build();
            }

            int todayYear = Integer.parseInt(tr.getEnd_date().substring(0, 4));
            int todayMonth = Integer.parseInt(tr.getEnd_date().substring(5, 7));
            int todayDay = Integer.parseInt(tr.getEnd_date().substring(8));
            int dateYear = Integer.parseInt(tr.getStart_date().substring(0, 4));
            int dateMonth = Integer.parseInt(tr.getStart_date().substring(5, 7));
            int dateDay = Integer.parseInt(tr.getStart_date().substring(8));

            if (dateYear > todayYear) {
                return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"starting date cannot be after ending date\"}").build();
            }

            if ((dateYear == todayYear) && (dateMonth > todayMonth)) {
                return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"starting date cannot be after ending date\"}").build();
            }

            if ((dateYear == todayYear) && (dateMonth == todayMonth) && (dateDay > todayDay)) {
                return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"starting date cannot be after ending date\"}").build();
            }

            ett.createNewTreatment(tr);
            return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\"Treatment Added\"}").build();

        } catch (ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).type("application/json").entity("{\"success\":\"Not Sure\"}").build();

    }

    @GET
    @Path("/CanMessage/{user_id}/{doctor_id}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response CanMessage(@PathParam("user_id") int user_id,
            @PathParam("doctor_id") int doctor_id) {

        EditRandevouzTable ert = new EditRandevouzTable();
        String answer = null;
        try {
            if (ert.databaseCheckForDoneRandvz(user_id, doctor_id) == null) {
                answer = "no";
            } else {
                answer = "yes";
            }

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }
        String json = new Gson().toJson(answer);
        return Response.status(Response.Status.OK).type("application/json").entity(json).build();
    }

    @GET
    @Path("/FreeRandevouz/{doctor_id}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response FreeRandevouz(@PathParam("doctor_id") int doctor_id) {

        EditRandevouzTable ert = new EditRandevouzTable();
        ArrayList<Randevouz> ranvz = null;
        try {
            ranvz = ert.databaseFreeRandvz(doctor_id);

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }
        String json = new Gson().toJson(ranvz);
        return Response.status(Response.Status.OK).type("application/json").entity(json).build();
    }

    @POST
    @Path("/newMessage")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response addMessage(String message) throws SQLException {

        Gson gson = new Gson();
        IncompleteMsg msg = gson.fromJson(message, IncompleteMsg.class);

        if (!"doctor".equals(msg.getSender()) && !"user".equals(msg.getSender())) {
            return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"Sender is either doctor or user, your's is neither\"}").build();
        }
        if ("".equals(msg.getMessage())) {
            return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"At least write something\"}").build();
        }

        try {
            EditSimpleUserTable esut = new EditSimpleUserTable();
            if (esut.databaseToSimpleId(msg.getUser()) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"no User exists with this id\"}").build();
            }

            EditDoctorTable edt = new EditDoctorTable();
            if (edt.databaseToDoctorId(msg.getDoctor()) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"no Doctor exists with this id\"}").build();

            }
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
            LocalDateTime date = LocalDateTime.now();
            String today = date.format(formatter);

            EditMessageTable emt = new EditMessageTable();
            Message ms = new Message(msg, today);
            emt.createNewMessage(ms);
            return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\"Message Sent\"}").build();
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).type("application/json").entity("{\"success\":\"Not Sure\"}").build();

    }

    @PUT
    @Path("/upadateRandevouz/{randevouz_id}/{user_id}/{user_info}/{status}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response upadateRandevouz(@PathParam("randevouz_id") int randevouz_id, @PathParam("user_id") int user_id,
            @PathParam("user_info") String user_info, @PathParam("status") String status, @HeaderParam("Accept") String acceptHeader) {
        try {
            EditSimpleUserTable esut = new EditSimpleUserTable();
            if (esut.databaseToSimpleId(user_id) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"no User exists with this id\"}").build();
            }
            EditRandevouzTable ert = new EditRandevouzTable();
            if (ert.databaseToRvzId(randevouz_id) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"no Randevouz exists with this id\"}").build();
            }

            if ((!"free".equals(status)) && (!"selected".equals(status)) && (!"cancelled".equals(status)) && (!"done".equals(status))) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Not acceptable status change\"}").build();
            }

            ert.updateRandevouz(randevouz_id, user_id, user_info, status);

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }

        return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\" randevouz " + randevouz_id + " Updated\"}").build();
    }

    //quick and dirty fix to the book randevou without message from the user, better way exists, wasnt sure how it works
    @PUT
    @Path("/upadateRandevouz/{randevouz_id}/{user_id}//{status}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response upadateRandevouz(@PathParam("randevouz_id") int randevouz_id, @PathParam("user_id") int user_id,
            @PathParam("status") String status, @HeaderParam("Accept") String acceptHeader) {
        try {
            EditSimpleUserTable esut = new EditSimpleUserTable();
            if (esut.databaseToSimpleId(user_id) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"no User exists with this id\"}").build();
            }
            EditRandevouzTable ert = new EditRandevouzTable();
            if (ert.databaseToRvzId(randevouz_id) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"no Randevouz exists with this id\"}").build();
            }

            if ((!"free".equals(status)) && (!"selected".equals(status)) && (!"cancelled".equals(status)) && (!"done".equals(status))) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Not acceptable status change\"}").build();
            }

            ert.updateRandevouz(randevouz_id, user_id, "", status);

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }

        return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\" randevouz " + randevouz_id + " Updated\"}").build();
    }

    @PUT
    @Path("/updateRandevouz/{randevouz_id}/{status}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response cancelRandevouz(@PathParam("randevouz_id") int randevouz_id, @PathParam("status") String status,
            @QueryParam("canceller") String canceller, @HeaderParam("Accept") String acceptHeader) {
        try {
            EditRandevouzTable ert = new EditRandevouzTable();
            Randevouz ranvz = ert.databaseToRvzId(randevouz_id);
            if (ranvz == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"no Randevouz exists with this id\"}").build();
            }
            if ((!"free".equals(status)) && (!"selected".equals(status)) && (!"cancelled".equals(status)) && (!"done".equals(status))) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Not acceptable status change\"}").build();
            }
            if (canceller != null) {
                if ((!"user".equals(canceller)) && (!"doctor".equals(canceller))) {
                    return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"canceller must be either doctor or user\"}").build();
                }
                if (ranvz.getUser_id() == 0) {
                    ert.deleteRandevouz(randevouz_id);
                } else {
                    ert.updateRandevouz(randevouz_id, status, canceller);
                }
            } else {
                ert.updateRandevouz(randevouz_id, status);

            }

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }

        return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\" randevouz " + randevouz_id + " Updated\"}").build();
    }

    @GET
    @Path("/pendingRandevouz/{id}/{type}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response pendingRandevouz(@PathParam("id") int id, @PathParam("type") String type) {

        EditRandevouzTable ert = new EditRandevouzTable();
        ArrayList<Randevouz> ranvz = null;
        try {
            if ((!"user".equals(type)) && (!"doctor".equals(type))) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"type must be either doctor or user\"}").build();
            }
            ranvz = ert.databasePendingRandvz(id, type);
            System.out.println(ranvz);

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }
        String json = new Gson().toJson(ranvz);
        return Response.status(Response.Status.OK).type("application/json").entity(json).build();
    }

    @GET
    @Path("/allRandevouz/{id}/{type}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response allRandevouz(@PathParam("id") int id, @PathParam("type") String type) {

        EditRandevouzTable ert = new EditRandevouzTable();
        ArrayList<Randevouz> ranvz = null;
        try {
            if ((!"user".equals(type)) && (!"doctor".equals(type))) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"type must be either doctor or user\"}").build();
            }
            ranvz = ert.databaseAllRandvz(id, type);
            System.out.println(ranvz);

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }
        String json = new Gson().toJson(ranvz);
        return Response.status(Response.Status.OK).type("application/json").entity(json).build();
    }

    @POST
    @Path("/newRandevouz")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.APPLICATION_JSON})
    public Response addRandevouz(String randevouz) throws SQLException {
        try {
            EditRandevouzTable ert = new EditRandevouzTable();
            Randevouz rn = ert.jsonToRandevouz(randevouz);
            EditDoctorTable edt = new EditDoctorTable();

            if (edt.databaseToDoctorId(rn.getDoctor_id()) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"couldn't find doctor in database\"}").build();
            }

            if (rn.getDate_time() == null || rn.getStatus() == null) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"Date and Status must be given\"}").build();
            }

            //conversion of localdate to string taken from stack overflown
            LocalDate date = java.time.LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            String rand_date = (rn.getDate_time()).substring(0, 10);
            String today = date.format(formatter);
            int todayYear = Integer.parseInt(today.substring(6));
            int todayMonth = Integer.parseInt(today.substring(3, 5));
            int todayDay = Integer.parseInt(today.substring(0, 2));
            int dateYear = Integer.parseInt(rand_date.substring(0, 4));
            int dateMonth = Integer.parseInt(rand_date.substring(5, 7));
            int dateDay = Integer.parseInt(rand_date.substring(8));

            if (dateYear < todayYear) {
                return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"It appears this date is years to the past\"}").build();
            }
            if ((dateYear == todayYear) && (dateMonth < todayMonth)) {
                return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"It appears this date is a few months past\"}").build();
            }
            if ((dateYear == todayYear) && (dateMonth == todayMonth) && (dateDay < todayDay)) {
                return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"It appears this date is a few days past\"}").build();
            }

            ArrayList<String> todayRands = ert.databaseRandvzToday(rn.getDoctor_id(), rand_date);

            String today_time = ((rn.getDate_time()).substring(11));
            int today_hour = Integer.parseInt(today_time.substring(0, 2));
            int today_mins = Integer.parseInt(today_time.substring(3, 5));

            int sz = todayRands.size();
            for (int i = 0; i < sz; i++) {

                String rand_time = (todayRands.get(i)).substring(11);

                int rand_hour = Integer.parseInt(rand_time.substring(0, 2));
                int rand_mins = Integer.parseInt(rand_time.substring(3, 5));
                int x = (today_hour * 60 + today_mins) - (rand_hour * 60 + rand_mins);

                if (x <= 30 && x >= -30) {
                    return Response.status(Response.Status.NOT_ACCEPTABLE).type("application/json").entity("{\"error\":\"New randevouz coincides with older one\"}").build();
                }

            }

            ert.createNewRandevouz(rn);
            return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\"Randevouz Added\"}").build();

        } catch (ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).type("application/json").entity("{\"success\":\"Not Sure\"}").build();

    }

    @GET
    @Path("/doneRandevouz/{id}/{type}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response doneRandevouz(@PathParam("id") int id, @PathParam("type") String type) {

        EditRandevouzTable ert = new EditRandevouzTable();
        ArrayList<Randevouz> ranvz = null;
        try {
            if ((!"user".equals(type)) && (!"doctor".equals(type))) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"type must be either doctor or user\"}").build();
            }
            ranvz = ert.databaseDoneRandvz(id, type);

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }
        String json = new Gson().toJson(ranvz);
        return Response.status(Response.Status.OK).type("application/json").entity(json).build();
    }

    @GET
    @Path("/docDoneRandevouz/{id}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response docDoneRandevouz(@PathParam("id") int id) {

        EditRandevouzTable ert = new EditRandevouzTable();
        ArrayList<Integer> ids = null;

        EditDoctorTable edtl = new EditDoctorTable();
        try {
            if (edtl.databaseToDoctorId(id) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"couldn't find doctor in database\"}").build();
            }

            ids = ert.databaseUserIdRand(id);

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }
        System.out.println(ids);
        String json = new Gson().toJson(ids);
        return Response.status(Response.Status.OK).type("application/json").entity(json).build();

    }

    @GET
    @Path("/doctor/{id}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getDoctpr(@PathParam("id") int id) {
        Doctor doc = null;
        EditDoctorTable edt = new EditDoctorTable();
        try {
            doc = edt.databaseToDoctorId(id);
        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }
        String json = new Gson().toJson(doc);
        return Response.status(Response.Status.OK).type("application/json").entity(json).build();
    }

    @GET
    @Path("/uncertified")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getuncertifiedDoctor() {
        ArrayList<Doctor> docs = null;
        EditDoctorTable edt = new EditDoctorTable();
        try {
            docs = edt.databaseToDoctors(0);
        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }
        String json = new Gson().toJson(docs);
        return Response.status(Response.Status.OK).type("application/json").entity(json).build();
    }

    @GET
    @Path("/users")
    @Produces({MediaType.APPLICATION_JSON})
    public Response getUsers() {
        ArrayList<SimpleUser> users = null;
        EditSimpleUserTable esut = new EditSimpleUserTable();
        try {
            users = esut.databaseToUsers();
        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }
        String json = new Gson().toJson(users);
        return Response.status(Response.Status.OK).type("application/json").entity(json).build();
    }

    @DELETE
    @Path("/userDelete/{userID}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUser(@PathParam("userID") int userID) {
        try {
            EditSimpleUserTable esut = new EditSimpleUserTable();

            if (esut.databaseToSimpleId(userID) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"No User has the input ID\"}").build();
            }

            esut.deleteUser(userID);

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }

        return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\"User Deleted\"}").build();
    }

    @DELETE
    @Path("/doctorDelete/{doctorID}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteDoc(@PathParam("doctorID") int doctorID) {
        try {
            EditDoctorTable edt = new EditDoctorTable();

            if (edt.databaseToDoctorId(doctorID) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"No Doctor has the input ID\"}").build();
            }

            edt.deleteDoctor(doctorID);

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }

        return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\"Doctor Deleted\"}").build();
    }

    @PUT
    @Path("/certifyDoctor/{doctorID}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response certifyDoctor(@PathParam("doctorID") int doctorID, @HeaderParam("Accept") String acceptHeader) {
        try {
            EditDoctorTable edt = new EditDoctorTable();
            if (edt.databaseToDoctorId(doctorID) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"No Doctor has the input ID\"}").build();
            }

            edt.certifyDoctor(doctorID);

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }

        return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\" doctor: " + doctorID + " Certified\"}").build();
    }

    @GET
    @Path("/user/{id}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response userInfo(@PathParam("id") int id) {

        EditSimpleUserTable esut = new EditSimpleUserTable();
        SimpleUser su = null;

        try {
            su = esut.databaseToSimpleId(id);
            if (su == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"couldn't find user in database\"}").build();
            }

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }

        String json = new Gson().toJson(su);
        return Response.status(Response.Status.OK).type("application/json").entity(json).build();

    }

    @GET
    @Path("/cancelledRandevouz/{id}/{type}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response cancelledRandevouz(@PathParam("id") int id, @PathParam("type") String type) {

        EditRandevouzTable ert = new EditRandevouzTable();
        ArrayList<Randevouz> ranvz = null;
        try {
            if ((!"user".equals(type)) && (!"doctor".equals(type))) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"type must be either doctor or user\"}").build();
            }
            ranvz = ert.databaseCancelledRandvz(id, type);

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }
        String json = new Gson().toJson(ranvz);
        return Response.status(Response.Status.OK).type("application/json").entity(json).build();
    }

    @DELETE
    @Path("/RandevouzDeletion/{RandevouzID}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteRandevouz(@PathParam("RandevouzID") int RanvzID) {
        try {
            EditRandevouzTable ert = new EditRandevouzTable();

            if (ert.databaseToRvzId(RanvzID) == null) {
                return Response.status(Response.Status.NOT_FOUND).type("application/json").entity("{\"error\":\"No Randevouz has the input ID\"}").build();
            }

            ert.deleteRandevouz(RanvzID);

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }

        return Response.status(Response.Status.OK).type("application/json").entity("{\"success\":\"Randevouz Deleted\"}").build();
    }

    @GET
    @Path("/inbox/{id}/{type}")
    @Produces({MediaType.APPLICATION_JSON})
    public Response IncomingMessages(@PathParam("id") int id, @PathParam("type") String type) {

        EditMessageTable emt = new EditMessageTable();
        ArrayList<Message> msgs = null;
        try {
            if ((!"user".equals(type)) && (!"doctor".equals(type))) {
                return Response.status(Response.Status.BAD_REQUEST).type("application/json").entity("{\"error\":\"type must be either doctor or user\"}").build();
            }
            msgs = emt.databaseIncMsg(id, type);

        } catch (SQLException | ClassNotFoundException ex) {
            Logger.getLogger(MedicalAPI.class.getName()).log(Level.SEVERE, null, ex);
        }
        String json = new Gson().toJson(msgs);
        return Response.status(Response.Status.OK).type("application/json").entity(json).build();
    }
}
