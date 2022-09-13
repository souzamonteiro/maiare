
#include <stdio.h>

#define PI 3.14159265359

#ifdef PI
    #undef PI
#endif

int main(int argc, char *argv[]) {
    printf("%g\n", PI);

    return 0;
}
