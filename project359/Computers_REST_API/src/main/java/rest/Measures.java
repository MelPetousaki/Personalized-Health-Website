/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package rest;

import mainClasses.BloodTest;

/**
 *
 * @author Vasilis Mavrogeorgis
 */
public class Measures {
    String test_date;
    String medical_center;
    double measure = 0;

    public Measures(BloodTest bt, String input_measure){
        test_date = bt.getTest_date();
        medical_center = bt.getMedical_center();
        if("blood_sugar".equals(input_measure))
            measure = bt.getBlood_sugar();
        else if("cholesterol".equals(input_measure))
            measure = bt.getCholesterol();
        else if("iron".equals(input_measure))
            measure = bt.getIron();
        else if("vitamin_d3".equals(input_measure))
            measure = bt.getVitamin_d3();
        else if("vitamin_b12".equals(input_measure))
            measure = bt.getVitamin_b12();
    }
}
