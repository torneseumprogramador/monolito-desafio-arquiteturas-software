ssh -i ~/Downloads/desafio-arquiteturas.pem ubuntu@54.233.30.205 -o ServerAliveInterval=60
ssh -i ~/Downloads/desafio-arquiteturas.pem ubuntu@56.124.88.162 -o ServerAliveInterval=60


sudo mkdir -p /mnt/efs
sudo mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport fs-06c56a4d2cf94c5d4.efs.sa-east-1.amazonaws.com:/ /mnt/efs

sudo vim /etc/fstab
fs-06c56a4d2cf94c5d4.efs.sa-east-1.amazonaws.com:/ /mnt/efs nfs4 defaults,_netdev 0 0

df -h | grep efs


echo "testessss de efs" > /mnt/efs/teste.txt