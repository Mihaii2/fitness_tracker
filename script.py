from scapy.all import sniff, IP

def print_packet(packet):
    if IP in packet and packet[IP].dst == '172.22.31.144':
        print(packet.show())

# Sniff packets and apply the filter
sniff(prn=print_packet, store=0)