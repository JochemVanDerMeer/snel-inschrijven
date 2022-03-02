# Snelinschrijven
🇺🇸 Translation: Enroll quickly

An enrollment application that allows users to make a reservation for a slot and allows the administrator to add and delete reservation slots. Built with Javascript, Python (Flask), HTML and CSS. Deployed with Heroku.

## Live version
This application is live on https://snelinschrijven.herokuapp.com


## Project Description

### Making reservations   
https://snelinschrijven.herokuapp.com/enroll

Users can choose a slot to reserve which the administrator has created. Users have to fill in a name and e-mailaddress. After having selected a slot to reserve, the users gets a confirmation e-mail with the details of the reservation.

<img src="https://github.com/JochemVanDerMeer/snel-inschrijven/blob/main/static/screenshot1.png" width="300">

### Administrator page
https://snelinschrijven.herokuapp.com/admin

**The administrator page is protected with a password. For demonstration purposes, use the password 'administrator' to access the page.**

The administrator can select a day to add or remove reservations. After selecting a day, the administator can view current reservation slots. The administrator can click an existing reservation slot to get the option to remove this slot. In the event that the administrator deletes a slot which already contains a reservation of a user, the user gets notified by e-mail that his reserved slot has been removed.

The administrator can click the grey button to add a new reservation slot to the selected day. Clicking this button shows a menu in which the administrator can fill in the desired start and end time of the reservation slot. After the administrator submits the form, the reservation slot becomes visible for users who can then select this slot to make a reservation.

<img src="https://github.com/JochemVanDerMeer/snel-inschrijven/blob/main/static/screenshot2.png" width="300">

## Reflection

This was a project that allowed me to learn more about how to work with Javascript and Flask. Before creating personal projects with Javascript frameworks, I wanted to start with coding in Vanilla Javascript to see what you can use it for. I wanted to experience by myself why it would be beneficial to use a Javascript framework. During this side project I learned why it is useful to learn a framework, which motivated me to learn ReactJS. My goal is to create my next side projects with Javascript frameworks such as ReactJS. 

From my experience at university I have experience with Python, which motivated me to use Flask as backend framework. I had done some projects before with Flask and Django and therefore I was able to use this knowledge for this project. I chose for Flask over Django, as I think it fits better for the experimental nature of this project.
