typedef struct {
    int a;
    float b;
    union {
        long c;
        double d;
    }
} e;

printf("%d\n", e.a);
printf("%f\n", e.b);
printf("%ld\n", e.c);
printf("%g\n", e.d);
