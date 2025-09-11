BitTorrent Client built from scratch using Nodejs

What is BitTorrent ? 
- Traditional Client-Server-DB Architecture: Client sends request to Server to download the file, Server fetches from DB and return to the Client

- BitTorrent: Peer-to-Peer file distribution protocol. File is splitted into small pieces and distributed between users. Simply said, when someone wants to download a file, there is a mechanic for the user to find other users and look for all the parts of the file.

==> Reduce the strain on the server.

- Key Concepts:
  Torrent file (.torrent): metadata decribes how to look for all of the pieces
  Tracker: A server that helps peers find each other
  Peers: Computers conne  cted to each other in a swarm 
  Seeder: A peer with the complete file who uploads pieces
  Leecher: A peer stil downloading
  Swarm: Total group of peers sharing a file


- BitTorrent protocol:
  Step 1: Send request to Tracker (which file to download) --> Respond a list of Peers (IP) --> Tracker add your IP to Swarm 

  Step 2: Connect to Peers in Swarm --> Peers tell you what pieces they have --> You tell peers what pieces you want

All the network message here are sent/received in the form of Buffer. So what is Buffer ?

Buffer is a container for raw byte, and 1 byte equals to 4 bits. Bit is just 0 or 1. Every data in your computer is represented by bits, which means data types are just an abstraction for bits. When communicate with any computer, in fact data is displayed 

Buffer's representation: <Buffer 02 04 06 08 0a 0c 0e 10>, each number is represent in hexadecimal.


