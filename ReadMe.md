# TTEC WebRTC Phone #

---

This project contains the Finesse WebRTC gadget along with support documentation.
1

## Finesse WebRTC Project Structure ##

| FolderName   | Description |
|--------------| --- |
| TTECPhone    | Finesse Gadget |
| unit_testing | Stand alone unit testing required before Pull |
| doc          | Infrastructure information and diagrams to support deployment |

## Design ##

### Notes ####
* For diagrams reference to WebRTC-Design.pdf
* Finesses functions are provides by a Cisco mobile agent design and follow the same type of design requirements.
* The WebRTC Phone is intended to be an Auto-Answer ONLY phone. Outcalling features are provided by Finesses Mobile agent function. While the code is available in the gadget, this is a development feature only.

### Interaction Flows ###

#### Finesse Agent Login ####
1. Agent logs into Finesse as a normal call by call mobile agent. ( Agent,PWD,DN, Call-by-Call, WebRTC Number)
   
    <b>**The Agent DN and WebRTC should be designed with a relationship (DN RCP-1000 LCP-2000, WebRTC 3000)</b>
2. Agent desktop will load with a local finesse gadget reference.
   
    <b>**Local TTECPhone.xml reference to ONLY local libraries, css, javascript</b>
3. TTECPhone looks for a current WebRTC token, if found then the token is utilized for authentication and connection.  Else TTECPhone collects finesse provided user credentials and logs into the WebRTC broker.
4. Upon successful authentication, a websocket is created and SIP registration  takes place.
5. TTECPhone UI is updated to show Registered ( Or the current stat of the phone)

#### Finesse Agent Call Flow ####
1. PSTN Originated call terminates on the SBC and then passed onto IVR ( CVP ).
2. Call receives IVR treatment and an Agent is selected. CVP sends a setup call to the Agent LCP port on CUCM.
3. UCCE receives the call on the LCP *(NO AUDIO YET) and a ICM sourced call is placed via RCP port on CUCM to the Agents WebRTC phone number.

   <b> CUCM route patterns need to be configured to send the call the the correct WebRTC Broker.</b>
4. Call arrives at the WebRTC broker and SIP signaling is tunneled over the web socket to the registered WebRTC device.
   
   No MTP is required for this call flow or media termination.
   Agent Re-Queue does <b>required MTP's</b> based on Cisco's internal requirements. 


## Requirements ##
* 3rd party signed SSL Certificate
* Agent access to Finesse and WebRTC client on port 443
* Agent must have a webrtc capable browser version (Firefox 44+, Chrome 23,Edge 79+ )

## Deployment ##

Deployment is broken into 3 parts.
1. WebRTC Broker deployment
2. Finesse Application deployment
3. Agent provisioning

#### Part 1 ####
* This is only need on initial install

1. Install WebRTC Broker ( Wazo-Asterisk )
2. Build SIP Trunks between CUCM & Broker 
3. Add CuCM Route Patterns 
4. Add / Sync Users to WebRTC Broker 
5. Build phones per user created 

#### Part 2 ####
1. Upload TTECPhone gadget to Finesses via 3rdpartygadget scp connection.
2. Update the team desktop layout. 

| FileName| Description |
| --- | --- |
| desktop-layout | Example layout  |


## Local Development ##
### INSTALLATION
1. Download the TTECPhone folder to your computer
2. Navigate to the base directory
```
cd C:\Code\TTECPhone
```
3. Install the package dependencies
```
npm i
```
4. Copy or rename the .env.example file to .env 
5. Using a text editor, make any changes required to the .env file
6. Build the project
```
npm run build
```
7. Copy the contents in TTECPhone/dist/* to /files/TTECPhone/* on the Finesse Server.

*You do not have to copy index.html, it is not used*

The Finesse server directory structure should appear as:
```
files
  TTECPhone
    assets
      [gadget assets]
    audio-test.wav
    gadget.html
    gadget.xml
    wazo-sdk.js
```
8. Add the gadget to your desktop layout config
```
Existing configuration...
<header>
    <!--  Please ensure that at least one gadget/component is present within every headercolumn tag -->
	<leftAlignedColumns>
		<headercolumn width="300px">
			<component id="cd-logo">
				<url>/desktop/scripts/js/logo.js</url>
			</component>
		</headercolumn>
		<headercolumn width="230px">
			<component id="agent-voice-state">
				<url>/desktop/scripts/js/agentvoicestate.component.js</url>
			</component>
		</headercolumn>
		<headercolumn width="251px">
			<component id="nonvoice-state-menu">
				<url>/desktop/scripts/js/nonvoice-state-menu.component.js</url>
			</component>
		</headercolumn>
		
ADD THIS...
<headercolumn width="600px">
	<gadget>/3rdpartygadget/files/TTECPhone/gadget.xml</gadget> 
</headercolumn>

More existing configuration...
</leftAlignedColumns>
```

