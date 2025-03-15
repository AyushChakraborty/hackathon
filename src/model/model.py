import torch                             #type:ignore
import torch.nn.functional as F          #type:ignore

checkpoint = torch.load("model_params.pth")
W1 = checkpoint['W1']
b1 = checkpoint['b1']
W2 = checkpoint['W2']
b2 = checkpoint['b2']
W3 = checkpoint['W3']
b3 = checkpoint['b3']
W4 = checkpoint['W4']
b4 = checkpoint['b4']

#X =     #get X after preprocessing its json form 

parameters = [W1, b1, W2, b2, W3, b3, W4, b4]

@torch.no_grad()
def out_logits(X):
        l1 = X@W1 + b1
        a1 = F.relu(l1)

        l2 = a1@W2 + b2  
        a2 = F.relu(l2)

        l3 = a2@W3 + b3 
        a3 = F.relu(l3)

        logits = a3@W4 + b4  
        return logits

logits_1 = out_logits(X)
probs = F.softmax(logits_1, dim=1)                #final probabilities of the classes

max_probs, max_indices = torch.max(probs, dim=1)  #get the max prob class
