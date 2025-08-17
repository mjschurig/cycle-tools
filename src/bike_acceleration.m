P = 250
cr = 0.0029
cwA = 0.31
rho = 1.2041
mf = 85;
g = 9.81
hm = 7800;
ha = 1/3;
hd = 1/3;

dx = 2000
L = 1100
La = L*ha;
Ld = L*hd;
L0 = L-La-Ld;
Na = La*1000/dx;
Nd = Ld*1000/dx;
N0 = L0*1000/dx;

alphaa = atan(hm/La/1000);
alphad = atan(-hm/Ld/1000);


odebasic = @(v,m,I,r,cr,cwA,rho,alpha) acceleration(P,v,m,I,r,cr,cwA,rho,alpha);

I = 0.096;
r = 0.29;
mb = 11;
m = mb+mf
odefun = @(t,y) [odebasic(y(1),m,I,r,cr,cwA,rho,0); y(1)];
tspan = [0, 600];
y0 = [0.001; 0];

[t,y] = ode45(odefun, tspan, y0);
y(:,1) = y(:,1)*3.6;
v1 = y(end,1)
x1 = y(end,2)

fun = @(x) interp1(t,y(:,2)-dx,x);
dt1 = fzero(fun,360)
plot(t,y(:,1));
hold on
xline(dt1);
dT1 = N0*dt1;

odefun = @(t,y) [odebasic(y(1),m,I,r,cr,cwA,rho,alphaa); y(1)];
[t,y] = ode45(odefun, tspan, y0);
y(:,1) = y(:,1)*3.6;
plot(t,y(:,1));
fun = @(x) interp1(t,y(:,2)-dx,x);
dt1 = fzero(fun,360)
dT1 = dT1 + Na*dt1;

odefun = @(t,y) [odebasic(y(1),m,I,r,cr,cwA,rho,alphad); y(1)];
[t,y] = ode45(odefun, tspan, y0);
y(:,1) = y(:,1)*3.6;
plot(t,y(:,1));
fun = @(x) interp1(t,y(:,2)-dx,x);
dt1 = fzero(fun,360)
dT1 = dT1 + Nd*dt1;

I = 0.096;
r = 0.34;
cwA = 0.33
cr = 0.0029
mb = 7.5
m = mb+mf
odefun = @(t,y) [odebasic(y(1),m,I,r,cr,cwA,rho,0); y(1)];

[t,y] = ode45(odefun, tspan, y0);
y(:,1) = y(:,1)*3.6;
v2 = y(end,1)
x2 = y(end,2)

fun = @(x) interp1(t,y(:,2)-dx,x);
dt2 = fzero(fun,360)
plot(t,y(:,1))
xline(dt2)
dT2 = N0*dt2;

odefun = @(t,y) [odebasic(y(1),m,I,r,cr,cwA,rho,alphaa); y(1)];
[t,y] = ode45(odefun, tspan, y0);
y(:,1) = y(:,1)*3.6;
plot(t,y(:,1));
fun = @(x) interp1(t,y(:,2)-dx,x);
dt2 = fzero(fun,360)
dT2 = dT2 + Na*dt2;

odefun = @(t,y) [odebasic(y(1),m,I,r,cr,cwA,rho,alphad); y(1)];
[t,y] = ode45(odefun, tspan, y0);
y(:,1) = y(:,1)*3.6;
plot(t,y(:,1));
fun = @(x) interp1(t,y(:,2)-dx,x);
dt2 = fzero(fun,360)
dT2 = dT2 + Nd*dt2;

dT = (dT2-dT1)/60