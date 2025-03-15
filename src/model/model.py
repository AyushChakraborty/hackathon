#code for the model, the architecture of the model is defined here
#input features: q_type, wpm, idle, latency, mouse_movement
#hidden layer 1: 10 nodes
#hidden layer 2: 10 nodes
#hidden layer 3: 5 nodes
#output logits layer: 3 nodes, where classes are low risk, mild risk, high risk

from datasets import load_dataset        #type:ignore
import matplotlib.pyplot as plt          #type:ignore
import torch                             #type:ignore
import torch.nn.functional as F          #type:ignore
import numpy as np


g = torch.Generator().manual_seed(2147)  #setting the seed for reproducibility  

#input will be a tensor of shape (batch_size, 5): X
X = torch.randn((80, 5) , generator=g)   #random input tensor, for now
y = torch.randint(0, 3, (80,))           #random target tensor, for now
#output will be a tensor of shape (batch_size, 3): y

#random initialization of weights and biases
W1 = torch.randn((5, 10), generator=g, requires_grad=True)
b1 = torch.randn((10, ), generator=g, requires_grad=True)

W2 = torch.randn((10, 10), generator=g, requires_grad=True)
b2 = torch.randn((10, ), generator=g, requires_grad=True)

W3 = torch.randn((10, 5), generator=g, requires_grad=True)
b3 = torch.randn((5, ), generator=g, requires_grad=True)

W4 = torch.randn((5, 3), generator=g, requires_grad=True)
b4 = torch.randn((3, ), generator=g, requires_grad=True)


parameters = [W1, b1, W2, b2, W3, b3]

#total num of params for bookkeeping
sum(p.nelement() for p in parameters) 


def train(iters, alpha=0.01):
    """
    function to train the model, uses stochastic gradient descent
    inputs: iters - number of iterations to train the model
    """

    for step in range(iters):
        #forward pass
        l1 = X@W1 + b1    #shape: (batch_size, 10)
        a1 = F.relu(l1)   #shape: (batch_size, 10)

        l2 = a1@W2 + b2   #shape: (batch_size, 10)
        a2 = F.relu(l2)

        l3 = a2@W3 + b3      #shape: (batch_size, 5)
        a3 = F.relu(l3)

        logits = a3@W4 + b4  #shape: (batch_size, 3)
        neg_log_loss = F.cross_entropy(logits, y)

        print(f"loss at iter {step+1}: {neg_log_loss.item()}")

        #backward pass
        for p in parameters:
            p.grad = None  #resetting the gradients, to avoid gradient accumulation
        neg_log_loss.backward()

        #update params
        for p in parameters:
            p.data -= alpha*p.grad    #SGD update        


#uncomment when needed to train
#train(10)

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

#again uncomment when needed to be seen
# print(max_indices)
# print(y)