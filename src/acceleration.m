function a = acceleration(P,v,m,I,r,cr,cwA,rho,alpha)
%ACCELERATION Summary of this function goes here
%   Detailed explanation goes here
ma = m+I/r;
g = 9.81;
Fg = m*g;
Fn = Fg*cos(alpha);
Fh = Fg*sin(alpha);
a = P/v/ma - cr*Fn/ma - cwA*rho*v^2/ma/2 - Fh/ma;
end