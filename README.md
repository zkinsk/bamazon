# bAmazon - Amazon like storefront

Basic command line storefront using MySql and node.js.

Here is a [Link] (https://www.youtube.com/watch?v=aXMaJYFlwHU&feature=youtu.be) to the app in action.

The app has three interfaces: 

- **Customer**
- **Manager**
- **Supervisor**

### Customer Interface: 
1. Queries database and lists all items for sale with a price
2. Takes customer item and purchase quanity
3. Checks purchase quantity against available inventory
4. Returns response based on availablity
5. Concludes Interaction

### Manager Interface: 
1. Allows a view of the entire inventory showing price and remaining inventory
  -It also highlights items that have an inventory quanity below 5
2. Consolidates the low inentory items into one list
3. Allows for the increase of item inventory
4. Allows for creation of an entirely new for purchase
    - The department into which a new item can be entered is limited by the existing departments
  
### Supervisor Interface: 
1. Allows for an overview of all departments
    - Individual Department Sales
    - Individual Department Overhead
    - Individual Department Pofit
    -Profit is calculated on the fly as the database is updated for purchases
2. Allows the supervisor to create a new department and enter its overhead
    - New departments are immediatly available for managers to enter products into
  
  
