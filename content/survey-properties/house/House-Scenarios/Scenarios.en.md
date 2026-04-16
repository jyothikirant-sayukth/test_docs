
---
title: "Scenarios"
weight: 1
---



## House Scenarios

### Building Partitions

A house's partition is determined based on the Roof Type and the Construction Status (Completed or In Progress).

# Construction Rules

{{< notice "note" >}} 
 <b>Completed</b> - If the House has walls and a slab.<br>
 <b>Not Completed</b> - If the House has pillars or walls but no slab.{{< /notice>}}<br>

If the construction is <b>Completed</b>,
| Roof Type                         | Floor Addition Allowed |
|--------------------------------------|-----------------------------|
| RCC                                  | ✅                          |
| AC sheets or Zinc sheets             | ❌                          |
| Container                            | ❌                          |
| Country or Mangalore tiles           | ❌                          |
| Shabad stones                        | ❌                          |
| Thatched                             | ❌                          |
| Mud Roof                             | ❌                          |
| Others                               | ❌                          |

## Additional Construction Rules

1. <b>Total Construction Area:</b> 
      - Must be <b>less than or equal to</b> the <b>site area</b>.
1. <b>Adding a 2nd Floor Construction:</b>  
      - <b>Length × Breadth</b> must be <b>less than</b> the <b>previous floor Length × breadth</b>.  
       {{< notice "note" >}} 
 If the first floor's length and breadth are greater than ground floor, then use the first floor's dimensions for the ground floor as well.{{< /notice>}}<br>
      - <b>Completed Year</b> must be <b>less than</b> the <b>previous floor's completed year</b>.
       {{< notice "note" >}} 
 For example, if the first floor of the house was built in 2019, then the second floor construction year must be greater than or equal to 2019.{{< /notice>}}<br>
1. <b>House & Apartment Rules:</b>  
      - If <b>House</b> is selected in <b>House Details</b>, multiple buildings <b>can be added</b> in <b>Building Partitions</b>.  
      - If <b>Apartment</b> is selected in <b>House Details</b>, we consider <b>Each Flat</b> as an <b>individual house</b>. So multiple buildings <b>cannot be added</b> in <b>Building Partitions</b>.

### Owner Details


| Owner Status | Aadhaar Card Available | Action                                  |
|------------------|----------------------------|----------------------------------------------|
| Alive            | Yes                         | Scan the Aadhaar card for verification       |
| Not Alive        | Yes                         | Use the Aadhaar card for verification        |
| Not Alive        | No                         | System generates a Random Aadhaar number        |
| Alive            | No                         | System generates a Random Aadhaar number        |

 ### Owner and Head-Residency

| Condition                                      | Action                                                   | 
|------------------------------------------------|----------------------------------------------------------|
| Owner and head are the same person and live in the house. | Owner and head live in the same house.                   | 
| Owner and head is different and does not live in the house.  | Owner lives in another panchayat, not in the registered house. | 
| Owner and head is same and does not live in the house. | Owner lives in different place.         | 