
// This file was generated on Mon Sep 12, 2022 21:34 (UTC-03) by REx v5.55 which is Copyright (c) 1979-2022 by Gunther Rademacher <grd@gmx.net>
// REx command line: web-c.ebnf -javascript -tree -main -backtrack

function web_c(string, parsingEventHandler)
{
  init(string, parsingEventHandler);

  var thisParser = this;

  this.ParseException = function(b, e, s, o, x)
  {
    var begin = b;
    var end = e;
    var state = s;
    var offending = o;
    var expected = x;

    this.getBegin = function() {return begin;};
    this.getEnd = function() {return end;};
    this.getState = function() {return state;};
    this.getExpected = function() {return expected;};
    this.getOffending = function() {return offending;};
    this.isAmbiguousInput = function() {return false;};

    this.getMessage = function()
    {
      return offending < 0
           ? "lexical analysis failed"
           : "syntax error";
    };
  };

  function init(source, parsingEventHandler)
  {
    eventHandler = parsingEventHandler;
    input = source;
    size = source.length;
    reset(0, 0, 0);
  }

  this.getInput = function()
  {
    return input;
  };

  this.getTokenOffset = function()
  {
    return b0;
  };

  this.getTokenEnd = function()
  {
    return e0;
  };

  function reset(l, b, e)
  {
            b0 = b; e0 = b;
    l1 = l; b1 = b; e1 = e;
    l2 = 0; b2 = 0; e2 = 0;
    l3 = 0; b3 = 0; e3 = 0;
    end = e;
    ex = -1;
    memo = {};
    eventHandler.reset(input);
  }

  this.reset = function(l, b, e)
  {
    reset(l, b, e);
  };

  this.getOffendingToken = function(e)
  {
    var o = e.getOffending();
    return o >= 0 ? web_c.TOKEN[o] : null;
  };

  this.getExpectedTokenSet = function(e)
  {
    var expected;
    if (e.getExpected() < 0)
    {
      expected = web_c.getTokenSet(- e.getState());
    }
    else
    {
      expected = [web_c.TOKEN[e.getExpected()]];
    }
    return expected;
  };

  this.getErrorMessage = function(e)
  {
    var message = e.getMessage();
    var found = this.getOffendingToken(e);
    var tokenSet = this.getExpectedTokenSet(e);
    var size = e.getEnd() - e.getBegin();
    message += (found == null ? "" : ", found " + found)
            + "\nwhile expecting "
            + (tokenSet.length == 1 ? tokenSet[0] : ("[" + tokenSet.join(", ") + "]"))
            + "\n"
            + (size == 0 || found != null ? "" : "after successfully scanning " + size + " characters beginning ");
    var prefix = input.substring(0, e.getBegin());
    var lines = prefix.split("\n");
    var line = lines.length;
    var column = lines[line - 1].length + 1;
    return message
         + "at line " + line + ", column " + column + ":\n..."
         + input.substring(e.getBegin(), Math.min(input.length, e.getBegin() + 64))
         + "...";
  };

  this.parse_Program = function()
  {
    eventHandler.startNonterminal("Program", e0);
    for (;;)
    {
      lookahead1(3);                // EOF | Identifier | Literal | '!' | '(' | '++' | '--' | '[' | 'sizeof' | '~'
      if (l1 == 1)                  // EOF
      {
        break;
      }
      parse_Statement();
    }
    consume(1);                     // EOF
    eventHandler.endNonterminal("Program", e0);
  };

  this.parse_Ignore = function()
  {
    eventHandler.startNonterminal("Ignore", e0);
    lookahead1(0);                  // WhiteSpace | Comment
    switch (l1)
    {
    case 4:                         // WhiteSpace
      consume(4);                   // WhiteSpace
      break;
    default:
      consume(5);                   // Comment
    }
    eventHandler.endNonterminal("Ignore", e0);
  };

  function parse_Statement()
  {
    eventHandler.startNonterminal("Statement", e0);
    parse_ExpressionStatement();
    eventHandler.endNonterminal("Statement", e0);
  }

  function parse_ExpressionStatement()
  {
    eventHandler.startNonterminal("ExpressionStatement", e0);
    parse_Expression();
    if (l1 == 6)                    // Semicolon
    {
      consume(6);                   // Semicolon
    }
    eventHandler.endNonterminal("ExpressionStatement", e0);
  }

  function parse_Expression()
  {
    eventHandler.startNonterminal("Expression", e0);
    parse_AssignmentExpression();
    for (;;)
    {
      if (l1 != 21)                 // ','
      {
        break;
      }
      consume(21);                  // ','
      parse_AssignmentExpression();
    }
    eventHandler.endNonterminal("Expression", e0);
  }

  function try_Expression()
  {
    try_AssignmentExpression();
    for (;;)
    {
      if (l1 != 21)                 // ','
      {
        break;
      }
      consumeT(21);                 // ','
      try_AssignmentExpression();
    }
  }

  function parse_AssignmentExpression()
  {
    eventHandler.startNonterminal("AssignmentExpression", e0);
    parse_LogicalORExpression();
    for (;;)
    {
      if (l1 != 10                  // '%='
       && l1 != 13                  // '&='
       && l1 != 17                  // '*='
       && l1 != 20                  // '+='
       && l1 != 24                  // '-='
       && l1 != 26                  // '/='
       && l1 != 29                  // '<<='
       && l1 != 31                  // '='
       && l1 != 36                  // '>>='
       && l1 != 40                  // '^='
       && l1 != 43)                 // '|='
      {
        break;
      }
      switch (l1)
      {
      case 31:                      // '='
        consume(31);                // '='
        break;
      case 17:                      // '*='
        consume(17);                // '*='
        break;
      case 26:                      // '/='
        consume(26);                // '/='
        break;
      case 10:                      // '%='
        consume(10);                // '%='
        break;
      case 20:                      // '+='
        consume(20);                // '+='
        break;
      case 24:                      // '-='
        consume(24);                // '-='
        break;
      case 29:                      // '<<='
        consume(29);                // '<<='
        break;
      case 36:                      // '>>='
        consume(36);                // '>>='
        break;
      case 13:                      // '&='
        consume(13);                // '&='
        break;
      case 40:                      // '^='
        consume(40);                // '^='
        break;
      default:
        consume(43);                // '|='
      }
      parse_LogicalORExpression();
    }
    eventHandler.endNonterminal("AssignmentExpression", e0);
  }

  function try_AssignmentExpression()
  {
    try_LogicalORExpression();
    for (;;)
    {
      if (l1 != 10                  // '%='
       && l1 != 13                  // '&='
       && l1 != 17                  // '*='
       && l1 != 20                  // '+='
       && l1 != 24                  // '-='
       && l1 != 26                  // '/='
       && l1 != 29                  // '<<='
       && l1 != 31                  // '='
       && l1 != 36                  // '>>='
       && l1 != 40                  // '^='
       && l1 != 43)                 // '|='
      {
        break;
      }
      switch (l1)
      {
      case 31:                      // '='
        consumeT(31);               // '='
        break;
      case 17:                      // '*='
        consumeT(17);               // '*='
        break;
      case 26:                      // '/='
        consumeT(26);               // '/='
        break;
      case 10:                      // '%='
        consumeT(10);               // '%='
        break;
      case 20:                      // '+='
        consumeT(20);               // '+='
        break;
      case 24:                      // '-='
        consumeT(24);               // '-='
        break;
      case 29:                      // '<<='
        consumeT(29);               // '<<='
        break;
      case 36:                      // '>>='
        consumeT(36);               // '>>='
        break;
      case 13:                      // '&='
        consumeT(13);               // '&='
        break;
      case 40:                      // '^='
        consumeT(40);               // '^='
        break;
      default:
        consumeT(43);               // '|='
      }
      try_LogicalORExpression();
    }
  }

  function parse_LogicalORExpression()
  {
    eventHandler.startNonterminal("LogicalORExpression", e0);
    parse_LogicalANDExpression();
    for (;;)
    {
      if (l1 != 44)                 // '||'
      {
        break;
      }
      consume(44);                  // '||'
      parse_LogicalANDExpression();
    }
    eventHandler.endNonterminal("LogicalORExpression", e0);
  }

  function try_LogicalORExpression()
  {
    try_LogicalANDExpression();
    for (;;)
    {
      if (l1 != 44)                 // '||'
      {
        break;
      }
      consumeT(44);                 // '||'
      try_LogicalANDExpression();
    }
  }

  function parse_LogicalANDExpression()
  {
    eventHandler.startNonterminal("LogicalANDExpression", e0);
    parse_BitwiseORExpression();
    for (;;)
    {
      if (l1 != 12)                 // '&&'
      {
        break;
      }
      consume(12);                  // '&&'
      parse_BitwiseORExpression();
    }
    eventHandler.endNonterminal("LogicalANDExpression", e0);
  }

  function try_LogicalANDExpression()
  {
    try_BitwiseORExpression();
    for (;;)
    {
      if (l1 != 12)                 // '&&'
      {
        break;
      }
      consumeT(12);                 // '&&'
      try_BitwiseORExpression();
    }
  }

  function parse_BitwiseORExpression()
  {
    eventHandler.startNonterminal("BitwiseORExpression", e0);
    parse_BitwiseXORExpression();
    for (;;)
    {
      if (l1 != 42)                 // '|'
      {
        break;
      }
      consume(42);                  // '|'
      parse_BitwiseXORExpression();
    }
    eventHandler.endNonterminal("BitwiseORExpression", e0);
  }

  function try_BitwiseORExpression()
  {
    try_BitwiseXORExpression();
    for (;;)
    {
      if (l1 != 42)                 // '|'
      {
        break;
      }
      consumeT(42);                 // '|'
      try_BitwiseXORExpression();
    }
  }

  function parse_BitwiseXORExpression()
  {
    eventHandler.startNonterminal("BitwiseXORExpression", e0);
    parse_BitwiseANDExpression();
    for (;;)
    {
      if (l1 != 39)                 // '^'
      {
        break;
      }
      consume(39);                  // '^'
      parse_BitwiseANDExpression();
    }
    eventHandler.endNonterminal("BitwiseXORExpression", e0);
  }

  function try_BitwiseXORExpression()
  {
    try_BitwiseANDExpression();
    for (;;)
    {
      if (l1 != 39)                 // '^'
      {
        break;
      }
      consumeT(39);                 // '^'
      try_BitwiseANDExpression();
    }
  }

  function parse_BitwiseANDExpression()
  {
    eventHandler.startNonterminal("BitwiseANDExpression", e0);
    parse_EqualityExpression();
    for (;;)
    {
      if (l1 != 11)                 // '&'
      {
        break;
      }
      consume(11);                  // '&'
      parse_EqualityExpression();
    }
    eventHandler.endNonterminal("BitwiseANDExpression", e0);
  }

  function try_BitwiseANDExpression()
  {
    try_EqualityExpression();
    for (;;)
    {
      if (l1 != 11)                 // '&'
      {
        break;
      }
      consumeT(11);                 // '&'
      try_EqualityExpression();
    }
  }

  function parse_EqualityExpression()
  {
    eventHandler.startNonterminal("EqualityExpression", e0);
    parse_RelationalExpression();
    for (;;)
    {
      if (l1 != 8                   // '!='
       && l1 != 32)                 // '=='
      {
        break;
      }
      switch (l1)
      {
      case 32:                      // '=='
        consume(32);                // '=='
        break;
      default:
        consume(8);                 // '!='
      }
      parse_RelationalExpression();
    }
    eventHandler.endNonterminal("EqualityExpression", e0);
  }

  function try_EqualityExpression()
  {
    try_RelationalExpression();
    for (;;)
    {
      if (l1 != 8                   // '!='
       && l1 != 32)                 // '=='
      {
        break;
      }
      switch (l1)
      {
      case 32:                      // '=='
        consumeT(32);               // '=='
        break;
      default:
        consumeT(8);                // '!='
      }
      try_RelationalExpression();
    }
  }

  function parse_RelationalExpression()
  {
    eventHandler.startNonterminal("RelationalExpression", e0);
    parse_ShiftExpression();
    switch (l1)
    {
    case 27:                        // '<'
      consume(27);                  // '<'
      break;
    case 30:                        // '<='
      consume(30);                  // '<='
      break;
    case 33:                        // '>'
      consume(33);                  // '>'
      break;
    default:
      consume(34);                  // '>='
    }
    for (;;)
    {
      lookahead1(6);                // EOF | Identifier | Literal | Semicolon | '!' | '!=' | '%=' | '&' | '&&' | '&=' |
                                    // '(' | ')' | '*=' | '++' | '+=' | ',' | '--' | '-=' | '/=' | '<<=' | '=' | '==' |
                                    // '>>=' | '[' | ']' | '^' | '^=' | 'sizeof' | '|' | '|=' | '||' | '~'
      switch (l1)
      {
      case 14:                      // '('
        lookahead2(2);              // Identifier | Literal | '!' | '(' | '++' | '--' | '[' | 'sizeof' | '~'
        switch (lk)
        {
        case 910:                   // '(' '('
          lookahead3(2);            // Identifier | Literal | '!' | '(' | '++' | '--' | '[' | 'sizeof' | '~'
          break;
        case 2382:                  // '(' '['
          lookahead3(4);            // Identifier | Literal | '!' | '(' | '++' | ',' | '--' | '[' | ']' | 'sizeof' | '~'
          break;
        case 142:                   // '(' Identifier
        case 206:                   // '(' Literal
          lookahead3(5);            // '%' | '*' | '+' | '-' | '/' | '<' | '<<' | '<=' | '>' | '>=' | '>>'
          break;
        case 462:                   // '(' '!'
        case 1230:                  // '(' '++'
        case 1486:                  // '(' '--'
        case 2638:                  // '(' 'sizeof'
        case 2894:                  // '(' '~'
          lookahead3(1);            // Identifier | Literal | '(' | '['
          break;
        }
        break;
      case 37:                      // '['
        lookahead2(4);              // Identifier | Literal | '!' | '(' | '++' | ',' | '--' | '[' | ']' | 'sizeof' | '~'
        switch (lk)
        {
        case 933:                   // '[' '('
          lookahead3(2);            // Identifier | Literal | '!' | '(' | '++' | '--' | '[' | 'sizeof' | '~'
          break;
        case 2469:                  // '[' ']'
          lookahead3(7);            // EOF | Identifier | Literal | Semicolon | '!' | '!=' | '%' | '%=' | '&' | '&&' |
                                    // '&=' | '(' | ')' | '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' |
                                    // '/' | '/=' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '[' | ']' | '^' | '^=' | 'sizeof' | '|' | '|=' | '||' | '~'
          break;
        case 165:                   // '[' Identifier
        case 229:                   // '[' Literal
          lookahead3(5);            // '%' | '*' | '+' | '-' | '/' | '<' | '<<' | '<=' | '>' | '>=' | '>>'
          break;
        case 1381:                  // '[' ','
        case 2405:                  // '[' '['
          lookahead3(4);            // Identifier | Literal | '!' | '(' | '++' | ',' | '--' | '[' | ']' | 'sizeof' | '~'
          break;
        case 485:                   // '[' '!'
        case 1253:                  // '[' '++'
        case 1509:                  // '[' '--'
        case 2661:                  // '[' 'sizeof'
        case 2917:                  // '[' '~'
          lookahead3(1);            // Identifier | Literal | '(' | '['
          break;
        }
        break;
      case 2:                       // Identifier
      case 3:                       // Literal
        lookahead2(7);              // EOF | Identifier | Literal | Semicolon | '!' | '!=' | '%' | '%=' | '&' | '&&' |
                                    // '&=' | '(' | ')' | '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' |
                                    // '/' | '/=' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '[' | ']' | '^' | '^=' | 'sizeof' | '|' | '|=' | '||' | '~'
        switch (lk)
        {
        case 578:                   // Identifier '%'
        case 1026:                  // Identifier '*'
        case 1154:                  // Identifier '+'
        case 1410:                  // Identifier '-'
        case 1602:                  // Identifier '/'
        case 1794:                  // Identifier '<<'
        case 2242:                  // Identifier '>>'
        case 579:                   // Literal '%'
        case 1027:                  // Literal '*'
        case 1155:                  // Literal '+'
        case 1411:                  // Literal '-'
        case 1603:                  // Literal '/'
        case 1795:                  // Literal '<<'
        case 2243:                  // Literal '>>'
          lookahead3(2);            // Identifier | Literal | '!' | '(' | '++' | '--' | '[' | 'sizeof' | '~'
          break;
        }
        break;
      case 7:                       // '!'
      case 19:                      // '++'
      case 23:                      // '--'
      case 41:                      // 'sizeof'
      case 45:                      // '~'
        lookahead2(1);              // Identifier | Literal | '(' | '['
        switch (lk)
        {
        case 903:                   // '!' '('
        case 915:                   // '++' '('
        case 919:                   // '--' '('
        case 937:                   // 'sizeof' '('
        case 941:                   // '~' '('
          lookahead3(2);            // Identifier | Literal | '!' | '(' | '++' | '--' | '[' | 'sizeof' | '~'
          break;
        case 2375:                  // '!' '['
        case 2387:                  // '++' '['
        case 2391:                  // '--' '['
        case 2409:                  // 'sizeof' '['
        case 2413:                  // '~' '['
          lookahead3(4);            // Identifier | Literal | '!' | '(' | '++' | ',' | '--' | '[' | ']' | 'sizeof' | '~'
          break;
        case 135:                   // '!' Identifier
        case 199:                   // '!' Literal
        case 147:                   // '++' Identifier
        case 211:                   // '++' Literal
        case 151:                   // '--' Identifier
        case 215:                   // '--' Literal
        case 169:                   // 'sizeof' Identifier
        case 233:                   // 'sizeof' Literal
        case 173:                   // '~' Identifier
        case 237:                   // '~' Literal
          lookahead3(7);            // EOF | Identifier | Literal | Semicolon | '!' | '!=' | '%' | '%=' | '&' | '&&' |
                                    // '&=' | '(' | ')' | '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' |
                                    // '/' | '/=' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '[' | ']' | '^' | '^=' | 'sizeof' | '|' | '|=' | '||' | '~'
          break;
        }
        break;
      default:
        lk = l1;
      }
      if (lk == 8654                // '(' '!' Identifier
       || lk == 8677                // '[' '!' Identifier
       || lk == 8770                // Identifier '%' Identifier
       || lk == 8771                // Literal '%' Identifier
       || lk == 9095                // '!' '(' Identifier
       || lk == 9102                // '(' '(' Identifier
       || lk == 9107                // '++' '(' Identifier
       || lk == 9111                // '--' '(' Identifier
       || lk == 9125                // '[' '(' Identifier
       || lk == 9129                // 'sizeof' '(' Identifier
       || lk == 9133                // '~' '(' Identifier
       || lk == 9218                // Identifier '*' Identifier
       || lk == 9219                // Literal '*' Identifier
       || lk == 9346                // Identifier '+' Identifier
       || lk == 9347                // Literal '+' Identifier
       || lk == 9422                // '(' '++' Identifier
       || lk == 9445                // '[' '++' Identifier
       || lk == 9573                // '[' ',' Identifier
       || lk == 9602                // Identifier '-' Identifier
       || lk == 9603                // Literal '-' Identifier
       || lk == 9678                // '(' '--' Identifier
       || lk == 9701                // '[' '--' Identifier
       || lk == 9794                // Identifier '/' Identifier
       || lk == 9795                // Literal '/' Identifier
       || lk == 9986                // Identifier '<<' Identifier
       || lk == 9987                // Literal '<<' Identifier
       || lk == 10434               // Identifier '>>' Identifier
       || lk == 10435               // Literal '>>' Identifier
       || lk == 10567               // '!' '[' Identifier
       || lk == 10574               // '(' '[' Identifier
       || lk == 10579               // '++' '[' Identifier
       || lk == 10583               // '--' '[' Identifier
       || lk == 10597               // '[' '[' Identifier
       || lk == 10601               // 'sizeof' '[' Identifier
       || lk == 10605               // '~' '[' Identifier
       || lk == 10830               // '(' 'sizeof' Identifier
       || lk == 10853               // '[' 'sizeof' Identifier
       || lk == 11086               // '(' '~' Identifier
       || lk == 11109               // '[' '~' Identifier
       || lk == 12750               // '(' '!' Literal
       || lk == 12773               // '[' '!' Literal
       || lk == 12866               // Identifier '%' Literal
       || lk == 12867               // Literal '%' Literal
       || lk == 13191               // '!' '(' Literal
       || lk == 13198               // '(' '(' Literal
       || lk == 13203               // '++' '(' Literal
       || lk == 13207               // '--' '(' Literal
       || lk == 13221               // '[' '(' Literal
       || lk == 13225               // 'sizeof' '(' Literal
       || lk == 13229               // '~' '(' Literal
       || lk == 13314               // Identifier '*' Literal
       || lk == 13315               // Literal '*' Literal
       || lk == 13442               // Identifier '+' Literal
       || lk == 13443               // Literal '+' Literal
       || lk == 13518               // '(' '++' Literal
       || lk == 13541               // '[' '++' Literal
       || lk == 13669               // '[' ',' Literal
       || lk == 13698               // Identifier '-' Literal
       || lk == 13699               // Literal '-' Literal
       || lk == 13774               // '(' '--' Literal
       || lk == 13797               // '[' '--' Literal
       || lk == 13890               // Identifier '/' Literal
       || lk == 13891               // Literal '/' Literal
       || lk == 14082               // Identifier '<<' Literal
       || lk == 14083               // Literal '<<' Literal
       || lk == 14530               // Identifier '>>' Literal
       || lk == 14531               // Literal '>>' Literal
       || lk == 14663               // '!' '[' Literal
       || lk == 14670               // '(' '[' Literal
       || lk == 14675               // '++' '[' Literal
       || lk == 14679               // '--' '[' Literal
       || lk == 14693               // '[' '[' Literal
       || lk == 14697               // 'sizeof' '[' Literal
       || lk == 14701               // '~' '[' Literal
       || lk == 14926               // '(' 'sizeof' Literal
       || lk == 14949               // '[' 'sizeof' Literal
       || lk == 15182               // '(' '~' Literal
       || lk == 15205               // '[' '~' Literal
       || lk == 29250               // Identifier '%' '!'
       || lk == 29251               // Literal '%' '!'
       || lk == 29575               // '!' '(' '!'
       || lk == 29582               // '(' '(' '!'
       || lk == 29587               // '++' '(' '!'
       || lk == 29591               // '--' '(' '!'
       || lk == 29605               // '[' '(' '!'
       || lk == 29609               // 'sizeof' '(' '!'
       || lk == 29613               // '~' '(' '!'
       || lk == 29698               // Identifier '*' '!'
       || lk == 29699               // Literal '*' '!'
       || lk == 29826               // Identifier '+' '!'
       || lk == 29827               // Literal '+' '!'
       || lk == 30053               // '[' ',' '!'
       || lk == 30082               // Identifier '-' '!'
       || lk == 30083               // Literal '-' '!'
       || lk == 30274               // Identifier '/' '!'
       || lk == 30275               // Literal '/' '!'
       || lk == 30466               // Identifier '<<' '!'
       || lk == 30467               // Literal '<<' '!'
       || lk == 30914               // Identifier '>>' '!'
       || lk == 30915               // Literal '>>' '!'
       || lk == 31047               // '!' '[' '!'
       || lk == 31054               // '(' '[' '!'
       || lk == 31059               // '++' '[' '!'
       || lk == 31063               // '--' '[' '!'
       || lk == 31077               // '[' '[' '!'
       || lk == 31081               // 'sizeof' '[' '!'
       || lk == 31085               // '~' '[' '!'
       || lk == 36999               // '!' Identifier '%'
       || lk == 37006               // '(' Identifier '%'
       || lk == 37011               // '++' Identifier '%'
       || lk == 37015               // '--' Identifier '%'
       || lk == 37029               // '[' Identifier '%'
       || lk == 37033               // 'sizeof' Identifier '%'
       || lk == 37037               // '~' Identifier '%'
       || lk == 37063               // '!' Literal '%'
       || lk == 37070               // '(' Literal '%'
       || lk == 37075               // '++' Literal '%'
       || lk == 37079               // '--' Literal '%'
       || lk == 37093               // '[' Literal '%'
       || lk == 37097               // 'sizeof' Literal '%'
       || lk == 37101               // '~' Literal '%'
       || lk == 39333               // '[' ']' '%'
       || lk == 57806               // '(' '!' '('
       || lk == 57829               // '[' '!' '('
       || lk == 57922               // Identifier '%' '('
       || lk == 57923               // Literal '%' '('
       || lk == 58247               // '!' '(' '('
       || lk == 58254               // '(' '(' '('
       || lk == 58259               // '++' '(' '('
       || lk == 58263               // '--' '(' '('
       || lk == 58277               // '[' '(' '('
       || lk == 58281               // 'sizeof' '(' '('
       || lk == 58285               // '~' '(' '('
       || lk == 58370               // Identifier '*' '('
       || lk == 58371               // Literal '*' '('
       || lk == 58498               // Identifier '+' '('
       || lk == 58499               // Literal '+' '('
       || lk == 58574               // '(' '++' '('
       || lk == 58597               // '[' '++' '('
       || lk == 58725               // '[' ',' '('
       || lk == 58754               // Identifier '-' '('
       || lk == 58755               // Literal '-' '('
       || lk == 58830               // '(' '--' '('
       || lk == 58853               // '[' '--' '('
       || lk == 58946               // Identifier '/' '('
       || lk == 58947               // Literal '/' '('
       || lk == 59138               // Identifier '<<' '('
       || lk == 59139               // Literal '<<' '('
       || lk == 59586               // Identifier '>>' '('
       || lk == 59587               // Literal '>>' '('
       || lk == 59719               // '!' '[' '('
       || lk == 59726               // '(' '[' '('
       || lk == 59731               // '++' '[' '('
       || lk == 59735               // '--' '[' '('
       || lk == 59749               // '[' '[' '('
       || lk == 59753               // 'sizeof' '[' '('
       || lk == 59757               // '~' '[' '('
       || lk == 59982               // '(' 'sizeof' '('
       || lk == 60005               // '[' 'sizeof' '('
       || lk == 60238               // '(' '~' '('
       || lk == 60261               // '[' '~' '('
       || lk == 65671               // '!' Identifier '*'
       || lk == 65678               // '(' Identifier '*'
       || lk == 65683               // '++' Identifier '*'
       || lk == 65687               // '--' Identifier '*'
       || lk == 65701               // '[' Identifier '*'
       || lk == 65705               // 'sizeof' Identifier '*'
       || lk == 65709               // '~' Identifier '*'
       || lk == 65735               // '!' Literal '*'
       || lk == 65742               // '(' Literal '*'
       || lk == 65747               // '++' Literal '*'
       || lk == 65751               // '--' Literal '*'
       || lk == 65765               // '[' Literal '*'
       || lk == 65769               // 'sizeof' Literal '*'
       || lk == 65773               // '~' Literal '*'
       || lk == 68005               // '[' ']' '*'
       || lk == 73863               // '!' Identifier '+'
       || lk == 73870               // '(' Identifier '+'
       || lk == 73875               // '++' Identifier '+'
       || lk == 73879               // '--' Identifier '+'
       || lk == 73893               // '[' Identifier '+'
       || lk == 73897               // 'sizeof' Identifier '+'
       || lk == 73901               // '~' Identifier '+'
       || lk == 73927               // '!' Literal '+'
       || lk == 73934               // '(' Literal '+'
       || lk == 73939               // '++' Literal '+'
       || lk == 73943               // '--' Literal '+'
       || lk == 73957               // '[' Literal '+'
       || lk == 73961               // 'sizeof' Literal '+'
       || lk == 73965               // '~' Literal '+'
       || lk == 76197               // '[' ']' '+'
       || lk == 78402               // Identifier '%' '++'
       || lk == 78403               // Literal '%' '++'
       || lk == 78727               // '!' '(' '++'
       || lk == 78734               // '(' '(' '++'
       || lk == 78739               // '++' '(' '++'
       || lk == 78743               // '--' '(' '++'
       || lk == 78757               // '[' '(' '++'
       || lk == 78761               // 'sizeof' '(' '++'
       || lk == 78765               // '~' '(' '++'
       || lk == 78850               // Identifier '*' '++'
       || lk == 78851               // Literal '*' '++'
       || lk == 78978               // Identifier '+' '++'
       || lk == 78979               // Literal '+' '++'
       || lk == 79205               // '[' ',' '++'
       || lk == 79234               // Identifier '-' '++'
       || lk == 79235               // Literal '-' '++'
       || lk == 79426               // Identifier '/' '++'
       || lk == 79427               // Literal '/' '++'
       || lk == 79618               // Identifier '<<' '++'
       || lk == 79619               // Literal '<<' '++'
       || lk == 80066               // Identifier '>>' '++'
       || lk == 80067               // Literal '>>' '++'
       || lk == 80199               // '!' '[' '++'
       || lk == 80206               // '(' '[' '++'
       || lk == 80211               // '++' '[' '++'
       || lk == 80215               // '--' '[' '++'
       || lk == 80229               // '[' '[' '++'
       || lk == 80233               // 'sizeof' '[' '++'
       || lk == 80237               // '~' '[' '++'
       || lk == 87397               // '[' ',' ','
       || lk == 88391               // '!' '[' ','
       || lk == 88398               // '(' '[' ','
       || lk == 88403               // '++' '[' ','
       || lk == 88407               // '--' '[' ','
       || lk == 88421               // '[' '[' ','
       || lk == 88425               // 'sizeof' '[' ','
       || lk == 88429               // '~' '[' ','
       || lk == 90247               // '!' Identifier '-'
       || lk == 90254               // '(' Identifier '-'
       || lk == 90259               // '++' Identifier '-'
       || lk == 90263               // '--' Identifier '-'
       || lk == 90277               // '[' Identifier '-'
       || lk == 90281               // 'sizeof' Identifier '-'
       || lk == 90285               // '~' Identifier '-'
       || lk == 90311               // '!' Literal '-'
       || lk == 90318               // '(' Literal '-'
       || lk == 90323               // '++' Literal '-'
       || lk == 90327               // '--' Literal '-'
       || lk == 90341               // '[' Literal '-'
       || lk == 90345               // 'sizeof' Literal '-'
       || lk == 90349               // '~' Literal '-'
       || lk == 92581               // '[' ']' '-'
       || lk == 94786               // Identifier '%' '--'
       || lk == 94787               // Literal '%' '--'
       || lk == 95111               // '!' '(' '--'
       || lk == 95118               // '(' '(' '--'
       || lk == 95123               // '++' '(' '--'
       || lk == 95127               // '--' '(' '--'
       || lk == 95141               // '[' '(' '--'
       || lk == 95145               // 'sizeof' '(' '--'
       || lk == 95149               // '~' '(' '--'
       || lk == 95234               // Identifier '*' '--'
       || lk == 95235               // Literal '*' '--'
       || lk == 95362               // Identifier '+' '--'
       || lk == 95363               // Literal '+' '--'
       || lk == 95589               // '[' ',' '--'
       || lk == 95618               // Identifier '-' '--'
       || lk == 95619               // Literal '-' '--'
       || lk == 95810               // Identifier '/' '--'
       || lk == 95811               // Literal '/' '--'
       || lk == 96002               // Identifier '<<' '--'
       || lk == 96003               // Literal '<<' '--'
       || lk == 96450               // Identifier '>>' '--'
       || lk == 96451               // Literal '>>' '--'
       || lk == 96583               // '!' '[' '--'
       || lk == 96590               // '(' '[' '--'
       || lk == 96595               // '++' '[' '--'
       || lk == 96599               // '--' '[' '--'
       || lk == 96613               // '[' '[' '--'
       || lk == 96617               // 'sizeof' '[' '--'
       || lk == 96621               // '~' '[' '--'
       || lk == 102535              // '!' Identifier '/'
       || lk == 102542              // '(' Identifier '/'
       || lk == 102547              // '++' Identifier '/'
       || lk == 102551              // '--' Identifier '/'
       || lk == 102565              // '[' Identifier '/'
       || lk == 102569              // 'sizeof' Identifier '/'
       || lk == 102573              // '~' Identifier '/'
       || lk == 102599              // '!' Literal '/'
       || lk == 102606              // '(' Literal '/'
       || lk == 102611              // '++' Literal '/'
       || lk == 102615              // '--' Literal '/'
       || lk == 102629              // '[' Literal '/'
       || lk == 102633              // 'sizeof' Literal '/'
       || lk == 102637              // '~' Literal '/'
       || lk == 104869              // '[' ']' '/'
       || lk == 110734              // '(' Identifier '<'
       || lk == 110757              // '[' Identifier '<'
       || lk == 110798              // '(' Literal '<'
       || lk == 110821              // '[' Literal '<'
       || lk == 114823              // '!' Identifier '<<'
       || lk == 114830              // '(' Identifier '<<'
       || lk == 114835              // '++' Identifier '<<'
       || lk == 114839              // '--' Identifier '<<'
       || lk == 114853              // '[' Identifier '<<'
       || lk == 114857              // 'sizeof' Identifier '<<'
       || lk == 114861              // '~' Identifier '<<'
       || lk == 114887              // '!' Literal '<<'
       || lk == 114894              // '(' Literal '<<'
       || lk == 114899              // '++' Literal '<<'
       || lk == 114903              // '--' Literal '<<'
       || lk == 114917              // '[' Literal '<<'
       || lk == 114921              // 'sizeof' Literal '<<'
       || lk == 114925              // '~' Literal '<<'
       || lk == 117157              // '[' ']' '<<'
       || lk == 123022              // '(' Identifier '<='
       || lk == 123045              // '[' Identifier '<='
       || lk == 123086              // '(' Literal '<='
       || lk == 123109              // '[' Literal '<='
       || lk == 135310              // '(' Identifier '>'
       || lk == 135333              // '[' Identifier '>'
       || lk == 135374              // '(' Literal '>'
       || lk == 135397              // '[' Literal '>'
       || lk == 139406              // '(' Identifier '>='
       || lk == 139429              // '[' Identifier '>='
       || lk == 139470              // '(' Literal '>='
       || lk == 139493              // '[' Literal '>='
       || lk == 143495              // '!' Identifier '>>'
       || lk == 143502              // '(' Identifier '>>'
       || lk == 143507              // '++' Identifier '>>'
       || lk == 143511              // '--' Identifier '>>'
       || lk == 143525              // '[' Identifier '>>'
       || lk == 143529              // 'sizeof' Identifier '>>'
       || lk == 143533              // '~' Identifier '>>'
       || lk == 143559              // '!' Literal '>>'
       || lk == 143566              // '(' Literal '>>'
       || lk == 143571              // '++' Literal '>>'
       || lk == 143575              // '--' Literal '>>'
       || lk == 143589              // '[' Literal '>>'
       || lk == 143593              // 'sizeof' Literal '>>'
       || lk == 143597              // '~' Literal '>>'
       || lk == 145829              // '[' ']' '>>'
       || lk == 152014              // '(' '!' '['
       || lk == 152037              // '[' '!' '['
       || lk == 152130              // Identifier '%' '['
       || lk == 152131              // Literal '%' '['
       || lk == 152455              // '!' '(' '['
       || lk == 152462              // '(' '(' '['
       || lk == 152467              // '++' '(' '['
       || lk == 152471              // '--' '(' '['
       || lk == 152485              // '[' '(' '['
       || lk == 152489              // 'sizeof' '(' '['
       || lk == 152493              // '~' '(' '['
       || lk == 152578              // Identifier '*' '['
       || lk == 152579              // Literal '*' '['
       || lk == 152706              // Identifier '+' '['
       || lk == 152707              // Literal '+' '['
       || lk == 152782              // '(' '++' '['
       || lk == 152805              // '[' '++' '['
       || lk == 152933              // '[' ',' '['
       || lk == 152962              // Identifier '-' '['
       || lk == 152963              // Literal '-' '['
       || lk == 153038              // '(' '--' '['
       || lk == 153061              // '[' '--' '['
       || lk == 153154              // Identifier '/' '['
       || lk == 153155              // Literal '/' '['
       || lk == 153346              // Identifier '<<' '['
       || lk == 153347              // Literal '<<' '['
       || lk == 153794              // Identifier '>>' '['
       || lk == 153795              // Literal '>>' '['
       || lk == 153927              // '!' '[' '['
       || lk == 153934              // '(' '[' '['
       || lk == 153939              // '++' '[' '['
       || lk == 153943              // '--' '[' '['
       || lk == 153957              // '[' '[' '['
       || lk == 153961              // 'sizeof' '[' '['
       || lk == 153965              // '~' '[' '['
       || lk == 154190              // '(' 'sizeof' '['
       || lk == 154213              // '[' 'sizeof' '['
       || lk == 154446              // '(' '~' '['
       || lk == 154469              // '[' '~' '['
       || lk == 157029              // '[' ',' ']'
       || lk == 158023              // '!' '[' ']'
       || lk == 158030              // '(' '[' ']'
       || lk == 158035              // '++' '[' ']'
       || lk == 158039              // '--' '[' ']'
       || lk == 158053              // '[' '[' ']'
       || lk == 158057              // 'sizeof' '[' ']'
       || lk == 158061              // '~' '[' ']'
       || lk == 168514              // Identifier '%' 'sizeof'
       || lk == 168515              // Literal '%' 'sizeof'
       || lk == 168839              // '!' '(' 'sizeof'
       || lk == 168846              // '(' '(' 'sizeof'
       || lk == 168851              // '++' '(' 'sizeof'
       || lk == 168855              // '--' '(' 'sizeof'
       || lk == 168869              // '[' '(' 'sizeof'
       || lk == 168873              // 'sizeof' '(' 'sizeof'
       || lk == 168877              // '~' '(' 'sizeof'
       || lk == 168962              // Identifier '*' 'sizeof'
       || lk == 168963              // Literal '*' 'sizeof'
       || lk == 169090              // Identifier '+' 'sizeof'
       || lk == 169091              // Literal '+' 'sizeof'
       || lk == 169317              // '[' ',' 'sizeof'
       || lk == 169346              // Identifier '-' 'sizeof'
       || lk == 169347              // Literal '-' 'sizeof'
       || lk == 169538              // Identifier '/' 'sizeof'
       || lk == 169539              // Literal '/' 'sizeof'
       || lk == 169730              // Identifier '<<' 'sizeof'
       || lk == 169731              // Literal '<<' 'sizeof'
       || lk == 170178              // Identifier '>>' 'sizeof'
       || lk == 170179              // Literal '>>' 'sizeof'
       || lk == 170311              // '!' '[' 'sizeof'
       || lk == 170318              // '(' '[' 'sizeof'
       || lk == 170323              // '++' '[' 'sizeof'
       || lk == 170327              // '--' '[' 'sizeof'
       || lk == 170341              // '[' '[' 'sizeof'
       || lk == 170345              // 'sizeof' '[' 'sizeof'
       || lk == 170349              // '~' '[' 'sizeof'
       || lk == 184898              // Identifier '%' '~'
       || lk == 184899              // Literal '%' '~'
       || lk == 185223              // '!' '(' '~'
       || lk == 185230              // '(' '(' '~'
       || lk == 185235              // '++' '(' '~'
       || lk == 185239              // '--' '(' '~'
       || lk == 185253              // '[' '(' '~'
       || lk == 185257              // 'sizeof' '(' '~'
       || lk == 185261              // '~' '(' '~'
       || lk == 185346              // Identifier '*' '~'
       || lk == 185347              // Literal '*' '~'
       || lk == 185474              // Identifier '+' '~'
       || lk == 185475              // Literal '+' '~'
       || lk == 185701              // '[' ',' '~'
       || lk == 185730              // Identifier '-' '~'
       || lk == 185731              // Literal '-' '~'
       || lk == 185922              // Identifier '/' '~'
       || lk == 185923              // Literal '/' '~'
       || lk == 186114              // Identifier '<<' '~'
       || lk == 186115              // Literal '<<' '~'
       || lk == 186562              // Identifier '>>' '~'
       || lk == 186563              // Literal '>>' '~'
       || lk == 186695              // '!' '[' '~'
       || lk == 186702              // '(' '[' '~'
       || lk == 186707              // '++' '[' '~'
       || lk == 186711              // '--' '[' '~'
       || lk == 186725              // '[' '[' '~'
       || lk == 186729              // 'sizeof' '[' '~'
       || lk == 186733)             // '~' '[' '~'
      {
        lk = memoized(0, e0);
        if (lk == 0)
        {
          var b0A = b0; var e0A = e0; var l1A = l1;
          var b1A = b1; var e1A = e1; var l2A = l2;
          var b2A = b2; var e2A = e2; var l3A = l3;
          var b3A = b3; var e3A = e3;
          try
          {
            try_ShiftExpression();
            lk = -1;
          }
          catch (p1A)
          {
            lk = -2;
          }
          b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
          b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
          b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
          b3 = b3A; e3 = e3A; end = e3A; }}}
          memoize(0, e0, lk);
        }
      }
      if (lk == -2
       || lk == 1                   // EOF
       || lk == 6                   // Semicolon
       || lk == 8                   // '!='
       || lk == 10                  // '%='
       || lk == 11                  // '&'
       || lk == 12                  // '&&'
       || lk == 13                  // '&='
       || lk == 15                  // ')'
       || lk == 17                  // '*='
       || lk == 20                  // '+='
       || lk == 21                  // ','
       || lk == 24                  // '-='
       || lk == 26                  // '/='
       || lk == 29                  // '<<='
       || lk == 31                  // '='
       || lk == 32                  // '=='
       || lk == 36                  // '>>='
       || lk == 38                  // ']'
       || lk == 39                  // '^'
       || lk == 40                  // '^='
       || lk == 42                  // '|'
       || lk == 43                  // '|='
       || lk == 44                  // '||'
       || lk == 1730                // Identifier '<'
       || lk == 1731                // Literal '<'
       || lk == 1922                // Identifier '<='
       || lk == 1923                // Literal '<='
       || lk == 2114                // Identifier '>'
       || lk == 2115                // Literal '>'
       || lk == 2178                // Identifier '>='
       || lk == 2179                // Literal '>='
       || lk == 110727              // '!' Identifier '<'
       || lk == 110739              // '++' Identifier '<'
       || lk == 110743              // '--' Identifier '<'
       || lk == 110761              // 'sizeof' Identifier '<'
       || lk == 110765              // '~' Identifier '<'
       || lk == 110791              // '!' Literal '<'
       || lk == 110803              // '++' Literal '<'
       || lk == 110807              // '--' Literal '<'
       || lk == 110825              // 'sizeof' Literal '<'
       || lk == 110829              // '~' Literal '<'
       || lk == 113061              // '[' ']' '<'
       || lk == 123015              // '!' Identifier '<='
       || lk == 123027              // '++' Identifier '<='
       || lk == 123031              // '--' Identifier '<='
       || lk == 123049              // 'sizeof' Identifier '<='
       || lk == 123053              // '~' Identifier '<='
       || lk == 123079              // '!' Literal '<='
       || lk == 123091              // '++' Literal '<='
       || lk == 123095              // '--' Literal '<='
       || lk == 123113              // 'sizeof' Literal '<='
       || lk == 123117              // '~' Literal '<='
       || lk == 125349              // '[' ']' '<='
       || lk == 135303              // '!' Identifier '>'
       || lk == 135315              // '++' Identifier '>'
       || lk == 135319              // '--' Identifier '>'
       || lk == 135337              // 'sizeof' Identifier '>'
       || lk == 135341              // '~' Identifier '>'
       || lk == 135367              // '!' Literal '>'
       || lk == 135379              // '++' Literal '>'
       || lk == 135383              // '--' Literal '>'
       || lk == 135401              // 'sizeof' Literal '>'
       || lk == 135405              // '~' Literal '>'
       || lk == 137637              // '[' ']' '>'
       || lk == 139399              // '!' Identifier '>='
       || lk == 139411              // '++' Identifier '>='
       || lk == 139415              // '--' Identifier '>='
       || lk == 139433              // 'sizeof' Identifier '>='
       || lk == 139437              // '~' Identifier '>='
       || lk == 139463              // '!' Literal '>='
       || lk == 139475              // '++' Literal '>='
       || lk == 139479              // '--' Literal '>='
       || lk == 139497              // 'sizeof' Literal '>='
       || lk == 139501              // '~' Literal '>='
       || lk == 141733)             // '[' ']' '>='
      {
        break;
      }
      parse_ShiftExpression();
    }
    eventHandler.endNonterminal("RelationalExpression", e0);
  }

  function try_RelationalExpression()
  {
    try_ShiftExpression();
    switch (l1)
    {
    case 27:                        // '<'
      consumeT(27);                 // '<'
      break;
    case 30:                        // '<='
      consumeT(30);                 // '<='
      break;
    case 33:                        // '>'
      consumeT(33);                 // '>'
      break;
    default:
      consumeT(34);                 // '>='
    }
    for (;;)
    {
      lookahead1(6);                // EOF | Identifier | Literal | Semicolon | '!' | '!=' | '%=' | '&' | '&&' | '&=' |
                                    // '(' | ')' | '*=' | '++' | '+=' | ',' | '--' | '-=' | '/=' | '<<=' | '=' | '==' |
                                    // '>>=' | '[' | ']' | '^' | '^=' | 'sizeof' | '|' | '|=' | '||' | '~'
      switch (l1)
      {
      case 14:                      // '('
        lookahead2(2);              // Identifier | Literal | '!' | '(' | '++' | '--' | '[' | 'sizeof' | '~'
        switch (lk)
        {
        case 910:                   // '(' '('
          lookahead3(2);            // Identifier | Literal | '!' | '(' | '++' | '--' | '[' | 'sizeof' | '~'
          break;
        case 2382:                  // '(' '['
          lookahead3(4);            // Identifier | Literal | '!' | '(' | '++' | ',' | '--' | '[' | ']' | 'sizeof' | '~'
          break;
        case 142:                   // '(' Identifier
        case 206:                   // '(' Literal
          lookahead3(5);            // '%' | '*' | '+' | '-' | '/' | '<' | '<<' | '<=' | '>' | '>=' | '>>'
          break;
        case 462:                   // '(' '!'
        case 1230:                  // '(' '++'
        case 1486:                  // '(' '--'
        case 2638:                  // '(' 'sizeof'
        case 2894:                  // '(' '~'
          lookahead3(1);            // Identifier | Literal | '(' | '['
          break;
        }
        break;
      case 37:                      // '['
        lookahead2(4);              // Identifier | Literal | '!' | '(' | '++' | ',' | '--' | '[' | ']' | 'sizeof' | '~'
        switch (lk)
        {
        case 933:                   // '[' '('
          lookahead3(2);            // Identifier | Literal | '!' | '(' | '++' | '--' | '[' | 'sizeof' | '~'
          break;
        case 2469:                  // '[' ']'
          lookahead3(7);            // EOF | Identifier | Literal | Semicolon | '!' | '!=' | '%' | '%=' | '&' | '&&' |
                                    // '&=' | '(' | ')' | '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' |
                                    // '/' | '/=' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '[' | ']' | '^' | '^=' | 'sizeof' | '|' | '|=' | '||' | '~'
          break;
        case 165:                   // '[' Identifier
        case 229:                   // '[' Literal
          lookahead3(5);            // '%' | '*' | '+' | '-' | '/' | '<' | '<<' | '<=' | '>' | '>=' | '>>'
          break;
        case 1381:                  // '[' ','
        case 2405:                  // '[' '['
          lookahead3(4);            // Identifier | Literal | '!' | '(' | '++' | ',' | '--' | '[' | ']' | 'sizeof' | '~'
          break;
        case 485:                   // '[' '!'
        case 1253:                  // '[' '++'
        case 1509:                  // '[' '--'
        case 2661:                  // '[' 'sizeof'
        case 2917:                  // '[' '~'
          lookahead3(1);            // Identifier | Literal | '(' | '['
          break;
        }
        break;
      case 2:                       // Identifier
      case 3:                       // Literal
        lookahead2(7);              // EOF | Identifier | Literal | Semicolon | '!' | '!=' | '%' | '%=' | '&' | '&&' |
                                    // '&=' | '(' | ')' | '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' |
                                    // '/' | '/=' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '[' | ']' | '^' | '^=' | 'sizeof' | '|' | '|=' | '||' | '~'
        switch (lk)
        {
        case 578:                   // Identifier '%'
        case 1026:                  // Identifier '*'
        case 1154:                  // Identifier '+'
        case 1410:                  // Identifier '-'
        case 1602:                  // Identifier '/'
        case 1794:                  // Identifier '<<'
        case 2242:                  // Identifier '>>'
        case 579:                   // Literal '%'
        case 1027:                  // Literal '*'
        case 1155:                  // Literal '+'
        case 1411:                  // Literal '-'
        case 1603:                  // Literal '/'
        case 1795:                  // Literal '<<'
        case 2243:                  // Literal '>>'
          lookahead3(2);            // Identifier | Literal | '!' | '(' | '++' | '--' | '[' | 'sizeof' | '~'
          break;
        }
        break;
      case 7:                       // '!'
      case 19:                      // '++'
      case 23:                      // '--'
      case 41:                      // 'sizeof'
      case 45:                      // '~'
        lookahead2(1);              // Identifier | Literal | '(' | '['
        switch (lk)
        {
        case 903:                   // '!' '('
        case 915:                   // '++' '('
        case 919:                   // '--' '('
        case 937:                   // 'sizeof' '('
        case 941:                   // '~' '('
          lookahead3(2);            // Identifier | Literal | '!' | '(' | '++' | '--' | '[' | 'sizeof' | '~'
          break;
        case 2375:                  // '!' '['
        case 2387:                  // '++' '['
        case 2391:                  // '--' '['
        case 2409:                  // 'sizeof' '['
        case 2413:                  // '~' '['
          lookahead3(4);            // Identifier | Literal | '!' | '(' | '++' | ',' | '--' | '[' | ']' | 'sizeof' | '~'
          break;
        case 135:                   // '!' Identifier
        case 199:                   // '!' Literal
        case 147:                   // '++' Identifier
        case 211:                   // '++' Literal
        case 151:                   // '--' Identifier
        case 215:                   // '--' Literal
        case 169:                   // 'sizeof' Identifier
        case 233:                   // 'sizeof' Literal
        case 173:                   // '~' Identifier
        case 237:                   // '~' Literal
          lookahead3(7);            // EOF | Identifier | Literal | Semicolon | '!' | '!=' | '%' | '%=' | '&' | '&&' |
                                    // '&=' | '(' | ')' | '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' |
                                    // '/' | '/=' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '[' | ']' | '^' | '^=' | 'sizeof' | '|' | '|=' | '||' | '~'
          break;
        }
        break;
      default:
        lk = l1;
      }
      if (lk == 8654                // '(' '!' Identifier
       || lk == 8677                // '[' '!' Identifier
       || lk == 8770                // Identifier '%' Identifier
       || lk == 8771                // Literal '%' Identifier
       || lk == 9095                // '!' '(' Identifier
       || lk == 9102                // '(' '(' Identifier
       || lk == 9107                // '++' '(' Identifier
       || lk == 9111                // '--' '(' Identifier
       || lk == 9125                // '[' '(' Identifier
       || lk == 9129                // 'sizeof' '(' Identifier
       || lk == 9133                // '~' '(' Identifier
       || lk == 9218                // Identifier '*' Identifier
       || lk == 9219                // Literal '*' Identifier
       || lk == 9346                // Identifier '+' Identifier
       || lk == 9347                // Literal '+' Identifier
       || lk == 9422                // '(' '++' Identifier
       || lk == 9445                // '[' '++' Identifier
       || lk == 9573                // '[' ',' Identifier
       || lk == 9602                // Identifier '-' Identifier
       || lk == 9603                // Literal '-' Identifier
       || lk == 9678                // '(' '--' Identifier
       || lk == 9701                // '[' '--' Identifier
       || lk == 9794                // Identifier '/' Identifier
       || lk == 9795                // Literal '/' Identifier
       || lk == 9986                // Identifier '<<' Identifier
       || lk == 9987                // Literal '<<' Identifier
       || lk == 10434               // Identifier '>>' Identifier
       || lk == 10435               // Literal '>>' Identifier
       || lk == 10567               // '!' '[' Identifier
       || lk == 10574               // '(' '[' Identifier
       || lk == 10579               // '++' '[' Identifier
       || lk == 10583               // '--' '[' Identifier
       || lk == 10597               // '[' '[' Identifier
       || lk == 10601               // 'sizeof' '[' Identifier
       || lk == 10605               // '~' '[' Identifier
       || lk == 10830               // '(' 'sizeof' Identifier
       || lk == 10853               // '[' 'sizeof' Identifier
       || lk == 11086               // '(' '~' Identifier
       || lk == 11109               // '[' '~' Identifier
       || lk == 12750               // '(' '!' Literal
       || lk == 12773               // '[' '!' Literal
       || lk == 12866               // Identifier '%' Literal
       || lk == 12867               // Literal '%' Literal
       || lk == 13191               // '!' '(' Literal
       || lk == 13198               // '(' '(' Literal
       || lk == 13203               // '++' '(' Literal
       || lk == 13207               // '--' '(' Literal
       || lk == 13221               // '[' '(' Literal
       || lk == 13225               // 'sizeof' '(' Literal
       || lk == 13229               // '~' '(' Literal
       || lk == 13314               // Identifier '*' Literal
       || lk == 13315               // Literal '*' Literal
       || lk == 13442               // Identifier '+' Literal
       || lk == 13443               // Literal '+' Literal
       || lk == 13518               // '(' '++' Literal
       || lk == 13541               // '[' '++' Literal
       || lk == 13669               // '[' ',' Literal
       || lk == 13698               // Identifier '-' Literal
       || lk == 13699               // Literal '-' Literal
       || lk == 13774               // '(' '--' Literal
       || lk == 13797               // '[' '--' Literal
       || lk == 13890               // Identifier '/' Literal
       || lk == 13891               // Literal '/' Literal
       || lk == 14082               // Identifier '<<' Literal
       || lk == 14083               // Literal '<<' Literal
       || lk == 14530               // Identifier '>>' Literal
       || lk == 14531               // Literal '>>' Literal
       || lk == 14663               // '!' '[' Literal
       || lk == 14670               // '(' '[' Literal
       || lk == 14675               // '++' '[' Literal
       || lk == 14679               // '--' '[' Literal
       || lk == 14693               // '[' '[' Literal
       || lk == 14697               // 'sizeof' '[' Literal
       || lk == 14701               // '~' '[' Literal
       || lk == 14926               // '(' 'sizeof' Literal
       || lk == 14949               // '[' 'sizeof' Literal
       || lk == 15182               // '(' '~' Literal
       || lk == 15205               // '[' '~' Literal
       || lk == 29250               // Identifier '%' '!'
       || lk == 29251               // Literal '%' '!'
       || lk == 29575               // '!' '(' '!'
       || lk == 29582               // '(' '(' '!'
       || lk == 29587               // '++' '(' '!'
       || lk == 29591               // '--' '(' '!'
       || lk == 29605               // '[' '(' '!'
       || lk == 29609               // 'sizeof' '(' '!'
       || lk == 29613               // '~' '(' '!'
       || lk == 29698               // Identifier '*' '!'
       || lk == 29699               // Literal '*' '!'
       || lk == 29826               // Identifier '+' '!'
       || lk == 29827               // Literal '+' '!'
       || lk == 30053               // '[' ',' '!'
       || lk == 30082               // Identifier '-' '!'
       || lk == 30083               // Literal '-' '!'
       || lk == 30274               // Identifier '/' '!'
       || lk == 30275               // Literal '/' '!'
       || lk == 30466               // Identifier '<<' '!'
       || lk == 30467               // Literal '<<' '!'
       || lk == 30914               // Identifier '>>' '!'
       || lk == 30915               // Literal '>>' '!'
       || lk == 31047               // '!' '[' '!'
       || lk == 31054               // '(' '[' '!'
       || lk == 31059               // '++' '[' '!'
       || lk == 31063               // '--' '[' '!'
       || lk == 31077               // '[' '[' '!'
       || lk == 31081               // 'sizeof' '[' '!'
       || lk == 31085               // '~' '[' '!'
       || lk == 36999               // '!' Identifier '%'
       || lk == 37006               // '(' Identifier '%'
       || lk == 37011               // '++' Identifier '%'
       || lk == 37015               // '--' Identifier '%'
       || lk == 37029               // '[' Identifier '%'
       || lk == 37033               // 'sizeof' Identifier '%'
       || lk == 37037               // '~' Identifier '%'
       || lk == 37063               // '!' Literal '%'
       || lk == 37070               // '(' Literal '%'
       || lk == 37075               // '++' Literal '%'
       || lk == 37079               // '--' Literal '%'
       || lk == 37093               // '[' Literal '%'
       || lk == 37097               // 'sizeof' Literal '%'
       || lk == 37101               // '~' Literal '%'
       || lk == 39333               // '[' ']' '%'
       || lk == 57806               // '(' '!' '('
       || lk == 57829               // '[' '!' '('
       || lk == 57922               // Identifier '%' '('
       || lk == 57923               // Literal '%' '('
       || lk == 58247               // '!' '(' '('
       || lk == 58254               // '(' '(' '('
       || lk == 58259               // '++' '(' '('
       || lk == 58263               // '--' '(' '('
       || lk == 58277               // '[' '(' '('
       || lk == 58281               // 'sizeof' '(' '('
       || lk == 58285               // '~' '(' '('
       || lk == 58370               // Identifier '*' '('
       || lk == 58371               // Literal '*' '('
       || lk == 58498               // Identifier '+' '('
       || lk == 58499               // Literal '+' '('
       || lk == 58574               // '(' '++' '('
       || lk == 58597               // '[' '++' '('
       || lk == 58725               // '[' ',' '('
       || lk == 58754               // Identifier '-' '('
       || lk == 58755               // Literal '-' '('
       || lk == 58830               // '(' '--' '('
       || lk == 58853               // '[' '--' '('
       || lk == 58946               // Identifier '/' '('
       || lk == 58947               // Literal '/' '('
       || lk == 59138               // Identifier '<<' '('
       || lk == 59139               // Literal '<<' '('
       || lk == 59586               // Identifier '>>' '('
       || lk == 59587               // Literal '>>' '('
       || lk == 59719               // '!' '[' '('
       || lk == 59726               // '(' '[' '('
       || lk == 59731               // '++' '[' '('
       || lk == 59735               // '--' '[' '('
       || lk == 59749               // '[' '[' '('
       || lk == 59753               // 'sizeof' '[' '('
       || lk == 59757               // '~' '[' '('
       || lk == 59982               // '(' 'sizeof' '('
       || lk == 60005               // '[' 'sizeof' '('
       || lk == 60238               // '(' '~' '('
       || lk == 60261               // '[' '~' '('
       || lk == 65671               // '!' Identifier '*'
       || lk == 65678               // '(' Identifier '*'
       || lk == 65683               // '++' Identifier '*'
       || lk == 65687               // '--' Identifier '*'
       || lk == 65701               // '[' Identifier '*'
       || lk == 65705               // 'sizeof' Identifier '*'
       || lk == 65709               // '~' Identifier '*'
       || lk == 65735               // '!' Literal '*'
       || lk == 65742               // '(' Literal '*'
       || lk == 65747               // '++' Literal '*'
       || lk == 65751               // '--' Literal '*'
       || lk == 65765               // '[' Literal '*'
       || lk == 65769               // 'sizeof' Literal '*'
       || lk == 65773               // '~' Literal '*'
       || lk == 68005               // '[' ']' '*'
       || lk == 73863               // '!' Identifier '+'
       || lk == 73870               // '(' Identifier '+'
       || lk == 73875               // '++' Identifier '+'
       || lk == 73879               // '--' Identifier '+'
       || lk == 73893               // '[' Identifier '+'
       || lk == 73897               // 'sizeof' Identifier '+'
       || lk == 73901               // '~' Identifier '+'
       || lk == 73927               // '!' Literal '+'
       || lk == 73934               // '(' Literal '+'
       || lk == 73939               // '++' Literal '+'
       || lk == 73943               // '--' Literal '+'
       || lk == 73957               // '[' Literal '+'
       || lk == 73961               // 'sizeof' Literal '+'
       || lk == 73965               // '~' Literal '+'
       || lk == 76197               // '[' ']' '+'
       || lk == 78402               // Identifier '%' '++'
       || lk == 78403               // Literal '%' '++'
       || lk == 78727               // '!' '(' '++'
       || lk == 78734               // '(' '(' '++'
       || lk == 78739               // '++' '(' '++'
       || lk == 78743               // '--' '(' '++'
       || lk == 78757               // '[' '(' '++'
       || lk == 78761               // 'sizeof' '(' '++'
       || lk == 78765               // '~' '(' '++'
       || lk == 78850               // Identifier '*' '++'
       || lk == 78851               // Literal '*' '++'
       || lk == 78978               // Identifier '+' '++'
       || lk == 78979               // Literal '+' '++'
       || lk == 79205               // '[' ',' '++'
       || lk == 79234               // Identifier '-' '++'
       || lk == 79235               // Literal '-' '++'
       || lk == 79426               // Identifier '/' '++'
       || lk == 79427               // Literal '/' '++'
       || lk == 79618               // Identifier '<<' '++'
       || lk == 79619               // Literal '<<' '++'
       || lk == 80066               // Identifier '>>' '++'
       || lk == 80067               // Literal '>>' '++'
       || lk == 80199               // '!' '[' '++'
       || lk == 80206               // '(' '[' '++'
       || lk == 80211               // '++' '[' '++'
       || lk == 80215               // '--' '[' '++'
       || lk == 80229               // '[' '[' '++'
       || lk == 80233               // 'sizeof' '[' '++'
       || lk == 80237               // '~' '[' '++'
       || lk == 87397               // '[' ',' ','
       || lk == 88391               // '!' '[' ','
       || lk == 88398               // '(' '[' ','
       || lk == 88403               // '++' '[' ','
       || lk == 88407               // '--' '[' ','
       || lk == 88421               // '[' '[' ','
       || lk == 88425               // 'sizeof' '[' ','
       || lk == 88429               // '~' '[' ','
       || lk == 90247               // '!' Identifier '-'
       || lk == 90254               // '(' Identifier '-'
       || lk == 90259               // '++' Identifier '-'
       || lk == 90263               // '--' Identifier '-'
       || lk == 90277               // '[' Identifier '-'
       || lk == 90281               // 'sizeof' Identifier '-'
       || lk == 90285               // '~' Identifier '-'
       || lk == 90311               // '!' Literal '-'
       || lk == 90318               // '(' Literal '-'
       || lk == 90323               // '++' Literal '-'
       || lk == 90327               // '--' Literal '-'
       || lk == 90341               // '[' Literal '-'
       || lk == 90345               // 'sizeof' Literal '-'
       || lk == 90349               // '~' Literal '-'
       || lk == 92581               // '[' ']' '-'
       || lk == 94786               // Identifier '%' '--'
       || lk == 94787               // Literal '%' '--'
       || lk == 95111               // '!' '(' '--'
       || lk == 95118               // '(' '(' '--'
       || lk == 95123               // '++' '(' '--'
       || lk == 95127               // '--' '(' '--'
       || lk == 95141               // '[' '(' '--'
       || lk == 95145               // 'sizeof' '(' '--'
       || lk == 95149               // '~' '(' '--'
       || lk == 95234               // Identifier '*' '--'
       || lk == 95235               // Literal '*' '--'
       || lk == 95362               // Identifier '+' '--'
       || lk == 95363               // Literal '+' '--'
       || lk == 95589               // '[' ',' '--'
       || lk == 95618               // Identifier '-' '--'
       || lk == 95619               // Literal '-' '--'
       || lk == 95810               // Identifier '/' '--'
       || lk == 95811               // Literal '/' '--'
       || lk == 96002               // Identifier '<<' '--'
       || lk == 96003               // Literal '<<' '--'
       || lk == 96450               // Identifier '>>' '--'
       || lk == 96451               // Literal '>>' '--'
       || lk == 96583               // '!' '[' '--'
       || lk == 96590               // '(' '[' '--'
       || lk == 96595               // '++' '[' '--'
       || lk == 96599               // '--' '[' '--'
       || lk == 96613               // '[' '[' '--'
       || lk == 96617               // 'sizeof' '[' '--'
       || lk == 96621               // '~' '[' '--'
       || lk == 102535              // '!' Identifier '/'
       || lk == 102542              // '(' Identifier '/'
       || lk == 102547              // '++' Identifier '/'
       || lk == 102551              // '--' Identifier '/'
       || lk == 102565              // '[' Identifier '/'
       || lk == 102569              // 'sizeof' Identifier '/'
       || lk == 102573              // '~' Identifier '/'
       || lk == 102599              // '!' Literal '/'
       || lk == 102606              // '(' Literal '/'
       || lk == 102611              // '++' Literal '/'
       || lk == 102615              // '--' Literal '/'
       || lk == 102629              // '[' Literal '/'
       || lk == 102633              // 'sizeof' Literal '/'
       || lk == 102637              // '~' Literal '/'
       || lk == 104869              // '[' ']' '/'
       || lk == 110734              // '(' Identifier '<'
       || lk == 110757              // '[' Identifier '<'
       || lk == 110798              // '(' Literal '<'
       || lk == 110821              // '[' Literal '<'
       || lk == 114823              // '!' Identifier '<<'
       || lk == 114830              // '(' Identifier '<<'
       || lk == 114835              // '++' Identifier '<<'
       || lk == 114839              // '--' Identifier '<<'
       || lk == 114853              // '[' Identifier '<<'
       || lk == 114857              // 'sizeof' Identifier '<<'
       || lk == 114861              // '~' Identifier '<<'
       || lk == 114887              // '!' Literal '<<'
       || lk == 114894              // '(' Literal '<<'
       || lk == 114899              // '++' Literal '<<'
       || lk == 114903              // '--' Literal '<<'
       || lk == 114917              // '[' Literal '<<'
       || lk == 114921              // 'sizeof' Literal '<<'
       || lk == 114925              // '~' Literal '<<'
       || lk == 117157              // '[' ']' '<<'
       || lk == 123022              // '(' Identifier '<='
       || lk == 123045              // '[' Identifier '<='
       || lk == 123086              // '(' Literal '<='
       || lk == 123109              // '[' Literal '<='
       || lk == 135310              // '(' Identifier '>'
       || lk == 135333              // '[' Identifier '>'
       || lk == 135374              // '(' Literal '>'
       || lk == 135397              // '[' Literal '>'
       || lk == 139406              // '(' Identifier '>='
       || lk == 139429              // '[' Identifier '>='
       || lk == 139470              // '(' Literal '>='
       || lk == 139493              // '[' Literal '>='
       || lk == 143495              // '!' Identifier '>>'
       || lk == 143502              // '(' Identifier '>>'
       || lk == 143507              // '++' Identifier '>>'
       || lk == 143511              // '--' Identifier '>>'
       || lk == 143525              // '[' Identifier '>>'
       || lk == 143529              // 'sizeof' Identifier '>>'
       || lk == 143533              // '~' Identifier '>>'
       || lk == 143559              // '!' Literal '>>'
       || lk == 143566              // '(' Literal '>>'
       || lk == 143571              // '++' Literal '>>'
       || lk == 143575              // '--' Literal '>>'
       || lk == 143589              // '[' Literal '>>'
       || lk == 143593              // 'sizeof' Literal '>>'
       || lk == 143597              // '~' Literal '>>'
       || lk == 145829              // '[' ']' '>>'
       || lk == 152014              // '(' '!' '['
       || lk == 152037              // '[' '!' '['
       || lk == 152130              // Identifier '%' '['
       || lk == 152131              // Literal '%' '['
       || lk == 152455              // '!' '(' '['
       || lk == 152462              // '(' '(' '['
       || lk == 152467              // '++' '(' '['
       || lk == 152471              // '--' '(' '['
       || lk == 152485              // '[' '(' '['
       || lk == 152489              // 'sizeof' '(' '['
       || lk == 152493              // '~' '(' '['
       || lk == 152578              // Identifier '*' '['
       || lk == 152579              // Literal '*' '['
       || lk == 152706              // Identifier '+' '['
       || lk == 152707              // Literal '+' '['
       || lk == 152782              // '(' '++' '['
       || lk == 152805              // '[' '++' '['
       || lk == 152933              // '[' ',' '['
       || lk == 152962              // Identifier '-' '['
       || lk == 152963              // Literal '-' '['
       || lk == 153038              // '(' '--' '['
       || lk == 153061              // '[' '--' '['
       || lk == 153154              // Identifier '/' '['
       || lk == 153155              // Literal '/' '['
       || lk == 153346              // Identifier '<<' '['
       || lk == 153347              // Literal '<<' '['
       || lk == 153794              // Identifier '>>' '['
       || lk == 153795              // Literal '>>' '['
       || lk == 153927              // '!' '[' '['
       || lk == 153934              // '(' '[' '['
       || lk == 153939              // '++' '[' '['
       || lk == 153943              // '--' '[' '['
       || lk == 153957              // '[' '[' '['
       || lk == 153961              // 'sizeof' '[' '['
       || lk == 153965              // '~' '[' '['
       || lk == 154190              // '(' 'sizeof' '['
       || lk == 154213              // '[' 'sizeof' '['
       || lk == 154446              // '(' '~' '['
       || lk == 154469              // '[' '~' '['
       || lk == 157029              // '[' ',' ']'
       || lk == 158023              // '!' '[' ']'
       || lk == 158030              // '(' '[' ']'
       || lk == 158035              // '++' '[' ']'
       || lk == 158039              // '--' '[' ']'
       || lk == 158053              // '[' '[' ']'
       || lk == 158057              // 'sizeof' '[' ']'
       || lk == 158061              // '~' '[' ']'
       || lk == 168514              // Identifier '%' 'sizeof'
       || lk == 168515              // Literal '%' 'sizeof'
       || lk == 168839              // '!' '(' 'sizeof'
       || lk == 168846              // '(' '(' 'sizeof'
       || lk == 168851              // '++' '(' 'sizeof'
       || lk == 168855              // '--' '(' 'sizeof'
       || lk == 168869              // '[' '(' 'sizeof'
       || lk == 168873              // 'sizeof' '(' 'sizeof'
       || lk == 168877              // '~' '(' 'sizeof'
       || lk == 168962              // Identifier '*' 'sizeof'
       || lk == 168963              // Literal '*' 'sizeof'
       || lk == 169090              // Identifier '+' 'sizeof'
       || lk == 169091              // Literal '+' 'sizeof'
       || lk == 169317              // '[' ',' 'sizeof'
       || lk == 169346              // Identifier '-' 'sizeof'
       || lk == 169347              // Literal '-' 'sizeof'
       || lk == 169538              // Identifier '/' 'sizeof'
       || lk == 169539              // Literal '/' 'sizeof'
       || lk == 169730              // Identifier '<<' 'sizeof'
       || lk == 169731              // Literal '<<' 'sizeof'
       || lk == 170178              // Identifier '>>' 'sizeof'
       || lk == 170179              // Literal '>>' 'sizeof'
       || lk == 170311              // '!' '[' 'sizeof'
       || lk == 170318              // '(' '[' 'sizeof'
       || lk == 170323              // '++' '[' 'sizeof'
       || lk == 170327              // '--' '[' 'sizeof'
       || lk == 170341              // '[' '[' 'sizeof'
       || lk == 170345              // 'sizeof' '[' 'sizeof'
       || lk == 170349              // '~' '[' 'sizeof'
       || lk == 184898              // Identifier '%' '~'
       || lk == 184899              // Literal '%' '~'
       || lk == 185223              // '!' '(' '~'
       || lk == 185230              // '(' '(' '~'
       || lk == 185235              // '++' '(' '~'
       || lk == 185239              // '--' '(' '~'
       || lk == 185253              // '[' '(' '~'
       || lk == 185257              // 'sizeof' '(' '~'
       || lk == 185261              // '~' '(' '~'
       || lk == 185346              // Identifier '*' '~'
       || lk == 185347              // Literal '*' '~'
       || lk == 185474              // Identifier '+' '~'
       || lk == 185475              // Literal '+' '~'
       || lk == 185701              // '[' ',' '~'
       || lk == 185730              // Identifier '-' '~'
       || lk == 185731              // Literal '-' '~'
       || lk == 185922              // Identifier '/' '~'
       || lk == 185923              // Literal '/' '~'
       || lk == 186114              // Identifier '<<' '~'
       || lk == 186115              // Literal '<<' '~'
       || lk == 186562              // Identifier '>>' '~'
       || lk == 186563              // Literal '>>' '~'
       || lk == 186695              // '!' '[' '~'
       || lk == 186702              // '(' '[' '~'
       || lk == 186707              // '++' '[' '~'
       || lk == 186711              // '--' '[' '~'
       || lk == 186725              // '[' '[' '~'
       || lk == 186729              // 'sizeof' '[' '~'
       || lk == 186733)             // '~' '[' '~'
      {
        lk = memoized(0, e0);
        if (lk == 0)
        {
          var b0A = b0; var e0A = e0; var l1A = l1;
          var b1A = b1; var e1A = e1; var l2A = l2;
          var b2A = b2; var e2A = e2; var l3A = l3;
          var b3A = b3; var e3A = e3;
          try
          {
            try_ShiftExpression();
            memoize(0, e0A, -1);
            continue;
          }
          catch (p1A)
          {
            b0 = b0A; e0 = e0A; l1 = l1A; if (l1 == 0) {end = e0A;} else {
            b1 = b1A; e1 = e1A; l2 = l2A; if (l2 == 0) {end = e1A;} else {
            b2 = b2A; e2 = e2A; l3 = l3A; if (l3 == 0) {end = e2A;} else {
            b3 = b3A; e3 = e3A; end = e3A; }}}
            memoize(0, e0A, -2);
            break;
          }
        }
      }
      if (lk == -2
       || lk == 1                   // EOF
       || lk == 6                   // Semicolon
       || lk == 8                   // '!='
       || lk == 10                  // '%='
       || lk == 11                  // '&'
       || lk == 12                  // '&&'
       || lk == 13                  // '&='
       || lk == 15                  // ')'
       || lk == 17                  // '*='
       || lk == 20                  // '+='
       || lk == 21                  // ','
       || lk == 24                  // '-='
       || lk == 26                  // '/='
       || lk == 29                  // '<<='
       || lk == 31                  // '='
       || lk == 32                  // '=='
       || lk == 36                  // '>>='
       || lk == 38                  // ']'
       || lk == 39                  // '^'
       || lk == 40                  // '^='
       || lk == 42                  // '|'
       || lk == 43                  // '|='
       || lk == 44                  // '||'
       || lk == 1730                // Identifier '<'
       || lk == 1731                // Literal '<'
       || lk == 1922                // Identifier '<='
       || lk == 1923                // Literal '<='
       || lk == 2114                // Identifier '>'
       || lk == 2115                // Literal '>'
       || lk == 2178                // Identifier '>='
       || lk == 2179                // Literal '>='
       || lk == 110727              // '!' Identifier '<'
       || lk == 110739              // '++' Identifier '<'
       || lk == 110743              // '--' Identifier '<'
       || lk == 110761              // 'sizeof' Identifier '<'
       || lk == 110765              // '~' Identifier '<'
       || lk == 110791              // '!' Literal '<'
       || lk == 110803              // '++' Literal '<'
       || lk == 110807              // '--' Literal '<'
       || lk == 110825              // 'sizeof' Literal '<'
       || lk == 110829              // '~' Literal '<'
       || lk == 113061              // '[' ']' '<'
       || lk == 123015              // '!' Identifier '<='
       || lk == 123027              // '++' Identifier '<='
       || lk == 123031              // '--' Identifier '<='
       || lk == 123049              // 'sizeof' Identifier '<='
       || lk == 123053              // '~' Identifier '<='
       || lk == 123079              // '!' Literal '<='
       || lk == 123091              // '++' Literal '<='
       || lk == 123095              // '--' Literal '<='
       || lk == 123113              // 'sizeof' Literal '<='
       || lk == 123117              // '~' Literal '<='
       || lk == 125349              // '[' ']' '<='
       || lk == 135303              // '!' Identifier '>'
       || lk == 135315              // '++' Identifier '>'
       || lk == 135319              // '--' Identifier '>'
       || lk == 135337              // 'sizeof' Identifier '>'
       || lk == 135341              // '~' Identifier '>'
       || lk == 135367              // '!' Literal '>'
       || lk == 135379              // '++' Literal '>'
       || lk == 135383              // '--' Literal '>'
       || lk == 135401              // 'sizeof' Literal '>'
       || lk == 135405              // '~' Literal '>'
       || lk == 137637              // '[' ']' '>'
       || lk == 139399              // '!' Identifier '>='
       || lk == 139411              // '++' Identifier '>='
       || lk == 139415              // '--' Identifier '>='
       || lk == 139433              // 'sizeof' Identifier '>='
       || lk == 139437              // '~' Identifier '>='
       || lk == 139463              // '!' Literal '>='
       || lk == 139475              // '++' Literal '>='
       || lk == 139479              // '--' Literal '>='
       || lk == 139497              // 'sizeof' Literal '>='
       || lk == 139501              // '~' Literal '>='
       || lk == 141733)             // '[' ']' '>='
      {
        break;
      }
      try_ShiftExpression();
    }
  }

  function parse_ShiftExpression()
  {
    eventHandler.startNonterminal("ShiftExpression", e0);
    parse_AdditiveExpression();
    for (;;)
    {
      if (l1 != 28                  // '<<'
       && l1 != 35)                 // '>>'
      {
        break;
      }
      switch (l1)
      {
      case 28:                      // '<<'
        consume(28);                // '<<'
        break;
      default:
        consume(35);                // '>>'
      }
      parse_AdditiveExpression();
    }
    eventHandler.endNonterminal("ShiftExpression", e0);
  }

  function try_ShiftExpression()
  {
    try_AdditiveExpression();
    for (;;)
    {
      if (l1 != 28                  // '<<'
       && l1 != 35)                 // '>>'
      {
        break;
      }
      switch (l1)
      {
      case 28:                      // '<<'
        consumeT(28);               // '<<'
        break;
      default:
        consumeT(35);               // '>>'
      }
      try_AdditiveExpression();
    }
  }

  function parse_AdditiveExpression()
  {
    eventHandler.startNonterminal("AdditiveExpression", e0);
    parse_MultiplicativeExpression();
    for (;;)
    {
      if (l1 != 18                  // '+'
       && l1 != 22)                 // '-'
      {
        break;
      }
      switch (l1)
      {
      case 18:                      // '+'
        consume(18);                // '+'
        break;
      default:
        consume(22);                // '-'
      }
      parse_MultiplicativeExpression();
    }
    eventHandler.endNonterminal("AdditiveExpression", e0);
  }

  function try_AdditiveExpression()
  {
    try_MultiplicativeExpression();
    for (;;)
    {
      if (l1 != 18                  // '+'
       && l1 != 22)                 // '-'
      {
        break;
      }
      switch (l1)
      {
      case 18:                      // '+'
        consumeT(18);               // '+'
        break;
      default:
        consumeT(22);               // '-'
      }
      try_MultiplicativeExpression();
    }
  }

  function parse_MultiplicativeExpression()
  {
    eventHandler.startNonterminal("MultiplicativeExpression", e0);
    parse_UnaryExpression();
    for (;;)
    {
      lookahead1(7);                // EOF | Identifier | Literal | Semicolon | '!' | '!=' | '%' | '%=' | '&' | '&&' |
                                    // '&=' | '(' | ')' | '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' |
                                    // '/' | '/=' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '[' | ']' | '^' | '^=' | 'sizeof' | '|' | '|=' | '||' | '~'
      if (l1 != 9                   // '%'
       && l1 != 16                  // '*'
       && l1 != 25)                 // '/'
      {
        break;
      }
      switch (l1)
      {
      case 16:                      // '*'
        consume(16);                // '*'
        break;
      case 25:                      // '/'
        consume(25);                // '/'
        break;
      default:
        consume(9);                 // '%'
      }
      parse_UnaryExpression();
    }
    eventHandler.endNonterminal("MultiplicativeExpression", e0);
  }

  function try_MultiplicativeExpression()
  {
    try_UnaryExpression();
    for (;;)
    {
      lookahead1(7);                // EOF | Identifier | Literal | Semicolon | '!' | '!=' | '%' | '%=' | '&' | '&&' |
                                    // '&=' | '(' | ')' | '*' | '*=' | '+' | '++' | '+=' | ',' | '-' | '--' | '-=' |
                                    // '/' | '/=' | '<' | '<<' | '<<=' | '<=' | '=' | '==' | '>' | '>=' | '>>' | '>>=' |
                                    // '[' | ']' | '^' | '^=' | 'sizeof' | '|' | '|=' | '||' | '~'
      if (l1 != 9                   // '%'
       && l1 != 16                  // '*'
       && l1 != 25)                 // '/'
      {
        break;
      }
      switch (l1)
      {
      case 16:                      // '*'
        consumeT(16);               // '*'
        break;
      case 25:                      // '/'
        consumeT(25);               // '/'
        break;
      default:
        consumeT(9);                // '%'
      }
      try_UnaryExpression();
    }
  }

  function parse_UnaryExpression()
  {
    eventHandler.startNonterminal("UnaryExpression", e0);
    lookahead1(2);                  // Identifier | Literal | '!' | '(' | '++' | '--' | '[' | 'sizeof' | '~'
    switch (l1)
    {
    case 41:                        // 'sizeof'
      consume(41);                  // 'sizeof'
      parse_PrimaryExpression();
      break;
    case 19:                        // '++'
      consume(19);                  // '++'
      parse_PrimaryExpression();
      break;
    case 23:                        // '--'
      consume(23);                  // '--'
      parse_PrimaryExpression();
      break;
    case 45:                        // '~'
      consume(45);                  // '~'
      parse_PrimaryExpression();
      break;
    case 7:                         // '!'
      consume(7);                   // '!'
      parse_PrimaryExpression();
      break;
    default:
      parse_PrimaryExpression();
    }
    eventHandler.endNonterminal("UnaryExpression", e0);
  }

  function try_UnaryExpression()
  {
    lookahead1(2);                  // Identifier | Literal | '!' | '(' | '++' | '--' | '[' | 'sizeof' | '~'
    switch (l1)
    {
    case 41:                        // 'sizeof'
      consumeT(41);                 // 'sizeof'
      try_PrimaryExpression();
      break;
    case 19:                        // '++'
      consumeT(19);                 // '++'
      try_PrimaryExpression();
      break;
    case 23:                        // '--'
      consumeT(23);                 // '--'
      try_PrimaryExpression();
      break;
    case 45:                        // '~'
      consumeT(45);                 // '~'
      try_PrimaryExpression();
      break;
    case 7:                         // '!'
      consumeT(7);                  // '!'
      try_PrimaryExpression();
      break;
    default:
      try_PrimaryExpression();
    }
  }

  function parse_PrimaryExpression()
  {
    eventHandler.startNonterminal("PrimaryExpression", e0);
    lookahead1(1);                  // Identifier | Literal | '(' | '['
    switch (l1)
    {
    case 2:                         // Identifier
      consume(2);                   // Identifier
      break;
    case 3:                         // Literal
      consume(3);                   // Literal
      break;
    case 37:                        // '['
      parse_ArrayLiteral();
      break;
    default:
      consume(14);                  // '('
      parse_Expression();
      consume(15);                  // ')'
    }
    eventHandler.endNonterminal("PrimaryExpression", e0);
  }

  function try_PrimaryExpression()
  {
    lookahead1(1);                  // Identifier | Literal | '(' | '['
    switch (l1)
    {
    case 2:                         // Identifier
      consumeT(2);                  // Identifier
      break;
    case 3:                         // Literal
      consumeT(3);                  // Literal
      break;
    case 37:                        // '['
      try_ArrayLiteral();
      break;
    default:
      consumeT(14);                 // '('
      try_Expression();
      consumeT(15);                 // ')'
    }
  }

  function parse_ArrayLiteral()
  {
    eventHandler.startNonterminal("ArrayLiteral", e0);
    consume(37);                    // '['
    lookahead1(4);                  // Identifier | Literal | '!' | '(' | '++' | ',' | '--' | '[' | ']' | 'sizeof' | '~'
    if (l1 != 21                    // ','
     && l1 != 38)                   // ']'
    {
      parse_AssignmentExpression();
    }
    for (;;)
    {
      if (l1 != 21)                 // ','
      {
        break;
      }
      consume(21);                  // ','
      lookahead1(4);                // Identifier | Literal | '!' | '(' | '++' | ',' | '--' | '[' | ']' | 'sizeof' | '~'
      if (l1 != 21                  // ','
       && l1 != 38)                 // ']'
      {
        parse_AssignmentExpression();
      }
    }
    consume(38);                    // ']'
    eventHandler.endNonterminal("ArrayLiteral", e0);
  }

  function try_ArrayLiteral()
  {
    consumeT(37);                   // '['
    lookahead1(4);                  // Identifier | Literal | '!' | '(' | '++' | ',' | '--' | '[' | ']' | 'sizeof' | '~'
    if (l1 != 21                    // ','
     && l1 != 38)                   // ']'
    {
      try_AssignmentExpression();
    }
    for (;;)
    {
      if (l1 != 21)                 // ','
      {
        break;
      }
      consumeT(21);                 // ','
      lookahead1(4);                // Identifier | Literal | '!' | '(' | '++' | ',' | '--' | '[' | ']' | 'sizeof' | '~'
      if (l1 != 21                  // ','
       && l1 != 38)                 // ']'
      {
        try_AssignmentExpression();
      }
    }
    consumeT(38);                   // ']'
  }

  function consume(t)
  {
    if (l1 == t)
    {
      eventHandler.terminal(web_c.TOKEN[l1], b1, e1);
      b0 = b1; e0 = e1; l1 = l2; if (l1 != 0) {
      b1 = b2; e1 = e2; l2 = l3; if (l2 != 0) {
      b2 = b3; e2 = e3; l3 = 0; }}
    }
    else
    {
      error(b1, e1, 0, l1, t);
    }
  }

  function consumeT(t)
  {
    if (l1 == t)
    {
      b0 = b1; e0 = e1; l1 = l2; if (l1 != 0) {
      b1 = b2; e1 = e2; l2 = l3; if (l2 != 0) {
      b2 = b3; e2 = e3; l3 = 0; }}
    }
    else
    {
      error(b1, e1, 0, l1, t);
    }
  }

  function lookahead1(tokenSetId)
  {
    if (l1 == 0)
    {
      l1 = match(tokenSetId);
      b1 = begin;
      e1 = end;
    }
  }

  function lookahead2(tokenSetId)
  {
    if (l2 == 0)
    {
      l2 = match(tokenSetId);
      b2 = begin;
      e2 = end;
    }
    lk = (l2 << 6) | l1;
  }

  function lookahead3(tokenSetId)
  {
    if (l3 == 0)
    {
      l3 = match(tokenSetId);
      b3 = begin;
      e3 = end;
    }
    lk |= l3 << 12;
  }

  function error(b, e, s, l, t)
  {
    if (e >= ex)
    {
      bx = b;
      ex = e;
      sx = s;
      lx = l;
      tx = t;
    }
    throw new thisParser.ParseException(bx, ex, sx, lx, tx);
  }

  var lk, b0, e0;
  var l1, b1, e1;
  var l2, b2, e2;
  var l3, b3, e3;
  var bx, ex, sx, lx, tx;
  var eventHandler;
  var memo;

  function memoize(i, e, v)
  {
    memo[(e << 0) + i] = v;
  }

  function memoized(i, e)
  {
    var v = memo[(e << 0) + i];
    return typeof v != "undefined" ? v : 0;
  }

  var input;
  var size;

  var begin;
  var end;

  function match(tokenSetId)
  {
    begin = end;
    var current = end;
    var result = web_c.INITIAL[tokenSetId];
    var state = 0;

    for (var code = result & 255; code != 0; )
    {
      var charclass;
      var c0 = current < size ? input.charCodeAt(current) : 0;
      ++current;
      if (c0 < 0x80)
      {
        charclass = web_c.MAP0[c0];
      }
      else if (c0 < 0xd800)
      {
        var c1 = c0 >> 5;
        charclass = web_c.MAP1[(c0 & 31) + web_c.MAP1[(c1 & 31) + web_c.MAP1[c1 >> 5]]];
      }
      else
      {
        if (c0 < 0xdc00)
        {
          var c1 = current < size ? input.charCodeAt(current) : 0;
          if (c1 >= 0xdc00 && c1 < 0xe000)
          {
            ++current;
            c0 = ((c0 & 0x3ff) << 10) + (c1 & 0x3ff) + 0x10000;
          }
        }

        var lo = 0, hi = 3;
        for (var m = 2; ; m = (hi + lo) >> 1)
        {
          if (web_c.MAP2[m] > c0) hi = m - 1;
          else if (web_c.MAP2[4 + m] < c0) lo = m + 1;
          else {charclass = web_c.MAP2[8 + m]; break;}
          if (lo > hi) {charclass = 0; break;}
        }
      }

      state = code;
      var i0 = (charclass << 8) + code - 1;
      code = web_c.TRANSITION[(i0 & 15) + web_c.TRANSITION[i0 >> 4]];

      if (code > 255)
      {
        result = code;
        code &= 255;
        end = current;
      }
    }

    result >>= 8;
    if (result == 0)
    {
      end = current - 1;
      var c1 = end < size ? input.charCodeAt(end) : 0;
      if (c1 >= 0xdc00 && c1 < 0xe000) --end;
      return error(begin, end, state, -1, -1);
    }

    if (end > size) end = size;
    return (result & 63) - 1;
  }

}

web_c.XmlSerializer = function(log, indent)
{
  var input = null;
  var delayedTag = null;
  var hasChildElement = false;
  var depth = 0;

  this.reset = function(string)
  {
    log("<?xml version=\"1.0\" encoding=\"UTF-8\"?" + ">");
    input = string;
    delayedTag = null;
    hasChildElement = false;
    depth = 0;
  };

  this.startNonterminal = function(tag, begin)
  {
    if (delayedTag != null)
    {
      log("<");
      log(delayedTag);
      log(">");
    }
    delayedTag = tag;
    if (indent)
    {
      log("\n");
      for (var i = 0; i < depth; ++i)
      {
        log("  ");
      }
    }
    hasChildElement = false;
    ++depth;
  };

  this.endNonterminal = function(tag, end)
  {
    --depth;
    if (delayedTag != null)
    {
      delayedTag = null;
      log("<");
      log(tag);
      log("/>");
    }
    else
    {
      if (indent)
      {
        if (hasChildElement)
        {
          log("\n");
          for (var i = 0; i < depth; ++i)
          {
            log("  ");
          }
        }
      }
      log("</");
      log(tag);
      log(">");
    }
    hasChildElement = true;
  };

  this.terminal = function(tag, begin, end)
  {
    if (tag.charAt(0) == '\'') tag = "TOKEN";
    this.startNonterminal(tag, begin);
    characters(begin, end);
    this.endNonterminal(tag, end);
  };

  this.whitespace = function(begin, end)
  {
    characters(begin, end);
  };

  function characters(begin, end)
  {
    if (begin < end)
    {
      if (delayedTag != null)
      {
        log("<");
        log(delayedTag);
        log(">");
        delayedTag = null;
      }
      log(input.substring(begin, end)
               .replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;"));
    }
  }
};

web_c.getTokenSet = function(tokenSetId)
{
  var set = [];
  var s = tokenSetId < 0 ? - tokenSetId : web_c.INITIAL[tokenSetId] & 255;
  for (var i = 0; i < 46; i += 32)
  {
    var j = i;
    var i0 = (i >> 5) * 151 + s - 1;
    var i1 = i0 >> 2;
    var f = web_c.EXPECTED[(i0 & 3) + web_c.EXPECTED[(i1 & 3) + web_c.EXPECTED[i1 >> 2]]];
    for ( ; f != 0; f >>>= 1, ++j)
    {
      if ((f & 1) != 0)
      {
        set.push(web_c.TOKEN[j]);
      }
    }
  }
  return set;
};

web_c.TopDownTreeBuilder = function()
{
  var input = null;
  var stack = null;

  this.reset = function(i)
  {
    input = i;
    stack = [];
  };

  this.startNonterminal = function(name, begin)
  {
    var nonterminal = new web_c.Nonterminal(name, begin, begin, []);
    if (stack.length > 0) addChild(nonterminal);
    stack.push(nonterminal);
  };

  this.endNonterminal = function(name, end)
  {
    stack[stack.length - 1].end = end;
    if (stack.length > 1) stack.pop();
  };

  this.terminal = function(name, begin, end)
  {
    addChild(new web_c.Terminal(name, begin, end));
  };

  this.whitespace = function(begin, end)
  {
  };

  function addChild(s)
  {
    var current = stack[stack.length - 1];
    current.children.push(s);
  }

  this.serialize = function(e)
  {
    e.reset(input);
    stack[0].send(e);
  };
};

web_c.Terminal = function(name, begin, end)
{
  this.begin = begin;
  this.end = end;

  this.send = function(e)
  {
    e.terminal(name, begin, end);
  };
};

web_c.Nonterminal = function(name, begin, end, children)
{
  this.begin = begin;
  this.end = end;

  this.send = function(e)
  {
    e.startNonterminal(name, begin);
    var pos = begin;
    children.forEach
    (
      function(c)
      {
        if (pos < c.begin) e.whitespace(pos, c.begin);
        c.send(e);
        pos = c.end;
      }
    );
    if (pos < end) e.whitespace(pos, end);
    e.endNonterminal(name, end);
  };
};

web_c.MAP0 =
[
  /*   0 */ 64, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 6, 7,
  /*  36 */ 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 20, 20, 20, 20, 20, 20, 21, 21, 7, 22, 23, 24, 25, 7,
  /*  64 */ 7, 26, 26, 26, 26, 27, 26, 28, 28, 28, 28, 28, 29, 28, 30, 28, 28, 28, 28, 28, 28, 31, 28, 28, 32, 28, 28,
  /*  91 */ 33, 34, 35, 36, 28, 7, 37, 38, 39, 40, 41, 42, 43, 44, 45, 28, 46, 47, 48, 49, 50, 51, 28, 52, 53, 54, 55,
  /* 118 */ 56, 57, 58, 59, 60, 7, 61, 7, 62, 7
];

web_c.MAP1 =
[
  /*   0 */ 54, 87, 87, 87, 87, 87, 87, 87, 85, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
  /*  27 */ 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87,
  /*  54 */ 119, 151, 213, 245, 278, 277, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278,
  /*  75 */ 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 182, 278, 278, 278, 278, 278, 278, 278, 278, 278,
  /*  96 */ 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278, 278,
  /* 117 */ 278, 278, 64, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 151 */ 1, 5, 6, 7, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 20, 20, 20, 20, 20, 20, 21, 21, 7, 22, 23,
  /* 180 */ 24, 25, 7, 7, 7, 7, 7, 7, 7, 7, 63, 63, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
  /* 214 */ 26, 26, 26, 26, 27, 26, 28, 28, 28, 28, 28, 29, 28, 30, 28, 28, 28, 28, 28, 28, 31, 28, 28, 32, 28, 28, 33,
  /* 241 */ 34, 35, 36, 28, 7, 37, 38, 39, 40, 41, 42, 43, 44, 45, 28, 46, 47, 48, 49, 50, 51, 28, 52, 53, 54, 55, 56,
  /* 268 */ 57, 58, 59, 60, 7, 61, 7, 62, 7, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
  /* 302 */ 7, 7, 7, 7, 7, 7, 7, 7
];

web_c.MAP2 =
[
  /*  0 */ 57344, 65279, 65280, 65536, 65278, 65279, 65533, 1114111, 7, 1, 7, 7
];

web_c.INITIAL =
[
  /* 0 */ 1, 2, 3, 4, 5, 6, 7, 8
];

web_c.TRANSITION =
[
  /*    0 */ 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1040, 1101,
  /*   18 */ 1101, 1447, 1101, 2625, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1254,
  /*   36 */ 1101, 2625, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1100, 1101, 1101, 1101, 1101, 1101,
  /*   54 */ 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1291, 1101, 2615, 1101, 1101,
  /*   72 */ 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1118, 1101, 1101, 1447, 1101, 2625, 1101, 1101, 1101, 1101,
  /*   90 */ 1101, 1101, 1101, 1101, 1101, 1101, 1170, 1101, 1101, 1447, 1101, 1377, 1101, 1101, 1101, 1101, 1101, 1101,
  /*  108 */ 1101, 1101, 1101, 1101, 1454, 1101, 1101, 1447, 1101, 2625, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101,
  /*  126 */ 1101, 1101, 1051, 1101, 1101, 1447, 1101, 2625, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101,
  /*  144 */ 2936, 1101, 2605, 1447, 1101, 2625, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1212, 1101,
  /*  162 */ 1101, 1447, 1101, 1325, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1277, 1101, 1101, 1447,
  /*  180 */ 1101, 2625, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 2223, 1101, 1101, 1447, 1101, 2625,
  /*  198 */ 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1062, 1101, 1101, 1315, 1101, 1697, 1101, 1101,
  /*  216 */ 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1226, 1102, 1299, 1341, 1101, 2625, 1101, 1101, 1101, 1101,
  /*  234 */ 1101, 1101, 1101, 1101, 1101, 1101, 1130, 1101, 1101, 1447, 1101, 2625, 1101, 1101, 1101, 1101, 1101, 1101,
  /*  252 */ 1101, 1101, 1101, 1101, 1240, 1101, 1367, 1341, 1101, 2625, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101,
  /*  270 */ 1101, 1101, 1393, 1101, 1101, 1447, 1101, 2625, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101,
  /*  288 */ 1433, 1101, 1101, 1447, 1101, 1739, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1470, 2197,
  /*  306 */ 1510, 1528, 2196, 2341, 2196, 2048, 2196, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 1554, 2197, 1510, 1528,
  /*  324 */ 2196, 2341, 2196, 2048, 2196, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 1593, 2197, 1510, 1407, 2196, 2341,
  /*  342 */ 2196, 2048, 2196, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 1765, 1101, 1101, 1447, 1101, 2625, 1101, 1101,
  /*  360 */ 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1073, 1101, 1647, 1687, 1101, 2625, 1101, 1101, 1101, 1101,
  /*  378 */ 1101, 1101, 1101, 1101, 1101, 1101, 2284, 1101, 1713, 1729, 1101, 1142, 1101, 1101, 1101, 1101, 1101, 1101,
  /*  396 */ 1101, 1101, 1101, 1101, 1084, 1101, 1196, 1755, 1101, 2625, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101,
  /*  414 */ 1101, 1101, 2131, 2197, 1510, 3163, 2196, 2118, 2196, 2048, 2196, 2663, 1101, 1101, 1101, 1101, 1101, 1101,
  /*  432 */ 1820, 2197, 1510, 1781, 2196, 2118, 2196, 2048, 2196, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 2131, 2197,
  /*  450 */ 1510, 1661, 2196, 2089, 2196, 2179, 2196, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 2131, 2197, 1510, 3090,
  /*  468 */ 2196, 2735, 2196, 2179, 2196, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 1807, 2197, 1510, 1661, 2196, 2089,
  /*  486 */ 2196, 2179, 2196, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 2144, 2197, 1510, 1661, 2196, 2089, 2196, 2179,
  /*  504 */ 2196, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 1879, 2197, 1510, 1661, 2196, 2089, 2196, 2179, 2196, 2663,
  /*  522 */ 1101, 1101, 1101, 1101, 1101, 1101, 1836, 1101, 1101, 1447, 1101, 2625, 1101, 1101, 1101, 1101, 1101, 1101,
  /*  540 */ 1101, 1101, 1101, 1101, 1261, 1101, 1101, 1447, 1101, 1351, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101,
  /*  558 */ 1101, 1101, 1154, 1101, 1101, 1447, 1101, 2625, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101,
  /*  576 */ 1494, 1101, 1101, 1447, 1101, 2625, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1866, 2655,
  /*  594 */ 1510, 2911, 2497, 2118, 1895, 1607, 2196, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 1920, 2197, 1510, 3163,
  /*  612 */ 2196, 2118, 2492, 2048, 2196, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 1998, 2197, 1510, 3163, 2196, 2118,
  /*  630 */ 2196, 2048, 1621, 2926, 1101, 1101, 1101, 1101, 1101, 1101, 2028, 2197, 1510, 3163, 2196, 2118, 2196, 1538,
  /*  648 */ 1568, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 2064, 2397, 1510, 2105, 2196, 2118, 2881, 3046, 2527, 2595,
  /*  666 */ 1101, 1101, 1101, 1101, 1101, 1101, 2160, 1631, 1510, 3163, 2195, 2118, 2196, 2048, 2196, 2213, 1101, 1101,
  /*  684 */ 1101, 1101, 1101, 1101, 2239, 2197, 1510, 1661, 2850, 2478, 1629, 2179, 1671, 2663, 1101, 1101, 1101, 1101,
  /*  702 */ 1101, 1101, 2131, 2693, 2274, 1661, 2196, 2089, 2196, 2179, 2196, 1484, 1101, 1101, 1101, 1101, 1101, 1101,
  /*  720 */ 2300, 1982, 2357, 1661, 3016, 2383, 2448, 2012, 2042, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 2131, 2197,
  /*  738 */ 1510, 1661, 2196, 2089, 2196, 2824, 2196, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 2424, 2078, 1510, 1661,
  /*  756 */ 2253, 2464, 2196, 3133, 2549, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 2131, 2197, 1510, 1661, 2196, 2089,
  /*  774 */ 3101, 2179, 2196, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 2131, 3060, 1510, 1850, 1973, 2089, 2531, 2179,
  /*  792 */ 2803, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 2131, 2765, 1510, 1661, 1962, 2408, 2196, 2314, 2328, 2663,
  /*  810 */ 1101, 1101, 1101, 1101, 1101, 1101, 2131, 2197, 1510, 1661, 2983, 2089, 2196, 2179, 2196, 2663, 1101, 1101,
  /*  828 */ 1101, 1101, 1101, 1101, 2513, 2896, 1510, 1661, 1417, 2089, 2551, 2179, 2547, 2663, 1101, 1101, 1101, 1101,
  /*  846 */ 1101, 1101, 2567, 2197, 1510, 1948, 2196, 2641, 2795, 2179, 3013, 2663, 1101, 1101, 1101, 1101, 1101, 1101,
  /*  864 */ 2679, 3173, 2709, 2723, 2438, 2089, 2966, 2751, 3107, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 2781, 2819,
  /*  882 */ 1510, 2840, 2866, 2089, 1577, 2952, 2982, 1934, 1101, 1101, 1101, 1101, 1101, 1101, 2999, 2197, 1510, 1661,
  /*  900 */ 2196, 2089, 2196, 2179, 2196, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 3032, 1791, 3076, 1661, 2196, 2089,
  /*  918 */ 2196, 2179, 2196, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 1879, 2174, 1510, 3123, 2196, 2089, 2196, 2179,
  /*  936 */ 2196, 2663, 1101, 1101, 1101, 1101, 1101, 1101, 2131, 2258, 1510, 1661, 2196, 2089, 2196, 2179, 2196, 2663,
  /*  954 */ 1101, 1101, 1101, 1101, 1101, 1101, 2131, 2197, 1510, 1661, 1904, 2581, 2196, 2179, 2196, 2663, 1101, 1101,
  /*  972 */ 1101, 1101, 1101, 1101, 2367, 1101, 1512, 1447, 1101, 2625, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101,
  /*  990 */ 1101, 1101, 3149, 1101, 1101, 1447, 1101, 2625, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101,
  /* 1008 */ 1101, 1101, 1101, 1254, 1101, 2615, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1183, 1101,
  /* 1026 */ 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1101, 1280, 0, 0, 0, 0, 0, 0,
  /* 1047 */ 0, 0, 10, 11, 0, 0, 0, 0, 0, 2560, 38, 2598, 0, 10, 11, 0, 0, 0, 0, 0, 4352, 40, 4392, 51, 10, 11, 0, 0, 0,
  /* 1076 */ 0, 0, 7203, 44, 7217, 0, 10, 11, 0, 0, 0, 0, 0, 8740, 46, 8754, 0, 10, 11, 0, 0, 0, 0, 0, 1280, 0, 0, 0, 0,
  /* 1105 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5120, 0, 0, 2048, 2048, 2048, 0, 2085, 2085, 0, 10, 11, 0, 0, 0, 0, 0,
  /* 1134 */ 5632, 0, 5632, 5632, 0, 10, 11, 0, 0, 0, 0, 0, 7680, 9472, 51, 10, 0, 0, 11, 0, 0, 0, 0, 0, 9984, 0, 9984,
  /* 1161 */ 9984, 0, 10, 11, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 0, 10, 10, 0, 1024, 11, 0, 0, 0, 0, 0, 512, 0, 0, 512,
  /* 1190 */ 512, 0, 0, 0, 0, 0, 0, 0, 0, 9216, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 0, 11, 11, 11, 11, 0, 11, 11, 0,
  /* 1221 */ 10, 1024, 0, 0, 0, 0, 0, 32, 32, 32, 4864, 41, 4905, 0, 10, 11, 0, 0, 0, 0, 0, 33, 33, 33, 5888, 42, 5930,
  /* 1248 */ 0, 10, 11, 0, 0, 0, 0, 0, 51, 0, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 53, 54, 0, 0, 0, 0, 0, 0, 3840,
  /* 1279 */ 3840, 3840, 3840, 0, 3840, 3840, 0, 10, 11, 0, 0, 0, 0, 0, 51, 0, 88, 91, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 1307 */ 5120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 87, 1588, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 51, 10, 0, 0, 1024, 0, 0,
  /* 1338 */ 0, 0, 0, 0, 0, 51, 1588, 10, 11, 0, 0, 94, 0, 0, 0, 0, 0, 0, 0, 51, 53, 0, 0, 54, 0, 0, 0, 0, 0, 6144, 0,
  /* 1369 */ 0, 0, 0, 0, 0, 0, 0, 6144, 0, 0, 0, 0, 0, 0, 51, 1024, 0, 0, 11, 0, 0, 0, 0, 0, 0, 12, 12, 12, 12, 0, 12,
  /* 1400 */ 12, 0, 10, 11, 0, 1079, 1079, 0, 0, 51, 1588, 0, 0, 1079, 0, 1118, 1082, 783, 783, 783, 783, 783, 783, 15,
  /* 1424 */ 783, 783, 783, 783, 783, 881, 783, 783, 783, 9, 0, 0, 0, 0, 6656, 43, 6699, 1588, 10, 11, 0, 0, 0, 0, 0,
  /* 1449 */ 51, 1588, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 11, 0, 0, 0, 0, 0, 0, 1037, 1037, 1037, 1037, 0, 1037,
  /* 1477 */ 1037, 0, 10, 11, 1079, 1080, 1038, 783, 783, 15, 783, 783, 783, 783, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10287,
  /* 1501 */ 10287, 0, 10, 11, 0, 0, 0, 0, 0, 0, 783, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11520, 0, 0, 51,
  /* 1531 */ 1588, 10, 11, 1079, 1080, 1118, 1082, 783, 783, 783, 783, 783, 783, 15, 783, 783, 783, 90, 10, 93, 11, 783,
  /* 1553 */ 783, 0, 1038, 1038, 1038, 1038, 0, 1038, 1038, 0, 10, 11, 1079, 1080, 1038, 783, 783, 783, 783, 783, 783,
  /* 1574 */ 783, 783, 916, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 898, 783, 783, 783, 783, 0, 1038,
  /* 1595 */ 1038, 1038, 1038, 0, 1038, 1038, 0, 10, 11, 1079, 0, 1038, 783, 783, 783, 783, 783, 783, 783, 908, 783,
  /* 1616 */ 783, 90, 10, 93, 11, 783, 783, 783, 783, 783, 783, 840, 915, 783, 783, 783, 783, 783, 783, 783, 783, 783,
  /* 1638 */ 15, 783, 783, 783, 783, 783, 783, 783, 0, 0, 0, 7424, 0, 0, 0, 0, 0, 0, 0, 0, 85, 0, 0, 0, 0, 51, 1588, 10,
  /* 1666 */ 11, 0, 0, 0, 0, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 878, 783, 783, 783, 783, 783, 7509, 0,
  /* 1689 */ 51, 1588, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 87, 10, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 7936, 8960, 2304,
  /* 1718 */ 2816, 3584, 4608, 5376, 6400, 6912, 0, 8448, 0, 10496, 11264, 7936, 8960, 51, 1588, 10, 11, 0, 0, 0, 0, 0,
  /* 1740 */ 0, 0, 0, 0, 0, 1536, 10, 0, 0, 11, 0, 0, 0, 0, 0, 0, 9302, 51, 1588, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  /* 1771 */ 1792, 1792, 0, 10, 11, 0, 0, 0, 0, 0, 0, 0, 51, 1588, 10, 11, 57, 0, 0, 1082, 783, 783, 783, 783, 783, 783,
  /* 1797 */ 783, 783, 783, 783, 846, 783, 783, 783, 783, 0, 0, 784, 784, 784, 784, 0, 784, 784, 0, 10, 11, 0, 0, 0,
  /* 1821 */ 783, 783, 783, 783, 0, 783, 783, 0, 10, 11, 0, 57, 57, 783, 783, 0, 9728, 9728, 9728, 9728, 0, 9728, 9728,
  /* 1844 */ 0, 10, 11, 0, 0, 0, 0, 0, 51, 1588, 10, 11, 0, 0, 0, 0, 783, 783, 783, 783, 783, 867, 0, 785, 785, 785,
  /* 1870 */ 785, 0, 785, 785, 0, 10, 11, 0, 0, 0, 783, 783, 783, 783, 0, 783, 783, 0, 10, 11, 0, 58, 0, 783, 783, 895,
  /* 1896 */ 783, 783, 897, 783, 783, 783, 783, 840, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 879, 783,
  /* 1917 */ 783, 783, 783, 0, 786, 786, 786, 786, 0, 786, 786, 0, 10, 11, 0, 0, 0, 783, 783, 783, 783, 783, 866, 783,
  /* 1941 */ 0, 0, 0, 0, 0, 0, 0, 0, 0, 51, 1588, 10, 11, 0, 0, 0, 0, 783, 783, 783, 866, 783, 783, 783, 783, 783, 873,
  /* 1968 */ 783, 783, 783, 783, 877, 783, 783, 783, 783, 783, 783, 783, 783, 874, 783, 783, 783, 783, 783, 783, 783,
  /* 1989 */ 783, 783, 783, 844, 783, 783, 783, 783, 0, 0, 787, 787, 787, 787, 0, 787, 787, 0, 10, 11, 0, 0, 0, 783,
  /* 2013 */ 783, 783, 783, 783, 907, 783, 783, 783, 783, 0, 0, 0, 0, 783, 910, 0, 788, 788, 788, 788, 0, 788, 788, 0,
  /* 2037 */ 10, 11, 0, 0, 0, 783, 783, 783, 783, 783, 914, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 90, 10,
  /* 2060 */ 93, 11, 783, 783, 0, 789, 789, 789, 789, 0, 789, 789, 0, 10, 11, 0, 57, 57, 783, 783, 783, 783, 830, 838,
  /* 2084 */ 783, 783, 783, 783, 783, 783, 783, 783, 783, 0, 0, 51, 10, 0, 0, 11, 0, 0, 0, 783, 783, 0, 0, 51, 1588, 10,
  /* 2110 */ 11, 57, 0, 0, 1082, 783, 783, 865, 783, 783, 783, 783, 0, 0, 51, 10, 123, 124, 11, 125, 126, 0, 783, 783,
  /* 2134 */ 783, 783, 0, 783, 783, 0, 10, 11, 0, 0, 0, 783, 783, 783, 783, 0, 783, 783, 0, 10, 11, 0, 0, 0, 783, 827,
  /* 2160 */ 0, 790, 790, 790, 790, 0, 790, 790, 0, 10, 11, 0, 0, 0, 783, 783, 783, 783, 836, 783, 783, 783, 783, 783,
  /* 2184 */ 783, 783, 783, 783, 783, 0, 0, 0, 0, 783, 783, 868, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783,
  /* 2207 */ 783, 783, 783, 783, 783, 0, 15, 783, 783, 783, 10767, 783, 783, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4096, 4096, 0,
  /* 2232 */ 10, 11, 0, 0, 0, 0, 0, 0, 791, 791, 791, 791, 0, 791, 791, 0, 10, 11, 0, 0, 0, 783, 783, 783, 783, 872,
  /* 2258 */ 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 848, 783, 783, 783, 0, 0, 843, 0, 0, 0, 0, 0, 0, 0,
  /* 2283 */ 0, 0, 0, 0, 0, 0, 0, 8237, 8237, 0, 10, 11, 0, 0, 0, 0, 0, 0, 792, 792, 792, 792, 0, 792, 792, 0, 10, 11,
  /* 2311 */ 0, 0, 0, 783, 783, 783, 783, 906, 783, 783, 783, 783, 783, 0, 0, 0, 0, 783, 783, 783, 783, 913, 783, 783,
  /* 2335 */ 783, 783, 783, 783, 783, 917, 783, 783, 783, 783, 0, 0, 51, 10, 123, 124, 11, 125, 126, 1118, 783, 783, 0,
  /* 2358 */ 852, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11056, 11056, 0, 10, 11, 0, 0, 0, 0, 0, 885, 887, 889, 783,
  /* 2387 */ 0, 0, 51, 10, 0, 0, 11, 0, 0, 0, 783, 783, 783, 833, 783, 783, 783, 783, 783, 842, 783, 783, 783, 783, 783,
  /* 2412 */ 0, 0, 51, 10, 0, 0, 11, 0, 0, 0, 783, 15, 0, 793, 793, 793, 793, 0, 793, 793, 0, 10, 11, 0, 0, 0, 783, 783,
  /* 2440 */ 783, 871, 783, 783, 783, 15, 783, 876, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 899, 783, 783,
  /* 2461 */ 783, 783, 783, 783, 888, 783, 783, 0, 0, 51, 10, 0, 0, 11, 0, 0, 0, 783, 783, 783, 878, 0, 0, 51, 10, 0, 0,
  /* 2488 */ 11, 0, 0, 0, 783, 783, 783, 783, 889, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 880, 783,
  /* 2511 */ 783, 783, 0, 794, 794, 794, 794, 0, 794, 794, 0, 10, 11, 0, 0, 0, 783, 783, 783, 887, 783, 783, 783, 783,
  /* 2535 */ 783, 783, 783, 783, 783, 783, 783, 783, 783, 900, 783, 783, 783, 906, 783, 783, 783, 783, 783, 783, 783,
  /* 2556 */ 783, 783, 783, 783, 783, 783, 783, 840, 783, 783, 783, 0, 795, 802, 802, 802, 0, 802, 802, 0, 10, 11, 0, 0,
  /* 2580 */ 0, 783, 783, 783, 890, 0, 0, 51, 10, 0, 0, 11, 0, 0, 0, 783, 783, 783, 913, 783, 783, 839, 0, 0, 0, 0, 0,
  /* 2607 */ 0, 0, 0, 0, 3328, 0, 0, 0, 0, 0, 0, 0, 0, 0, 51, 0, 0, 0, 0, 0, 0, 0, 0, 0, 51, 10, 0, 0, 11, 0, 0, 0, 0,
  /* 2640 */ 0, 886, 783, 783, 783, 0, 0, 51, 10, 0, 0, 11, 0, 0, 0, 783, 783, 830, 783, 783, 837, 783, 783, 783, 783,
  /* 2665 */ 783, 783, 783, 783, 783, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 796, 796, 796, 796, 0, 796, 796, 0, 10, 11, 0, 0, 0,
  /* 2693 */ 783, 783, 831, 783, 783, 783, 783, 783, 783, 783, 843, 783, 783, 783, 851, 0, 0, 845, 0, 0, 0, 0, 0, 0, 0,
  /* 2718 */ 0, 0, 0, 0, 0, 0, 0, 51, 1588, 10, 11, 0, 0, 0, 0, 783, 864, 783, 783, 783, 783, 0, 0, 51, 10, 0, 0, 11, 0,
  /* 2747 */ 0, 0, 1039, 783, 783, 904, 783, 783, 783, 783, 783, 783, 783, 783, 0, 0, 0, 0, 783, 783, 832, 66, 783, 839,
  /* 2771 */ 828, 783, 841, 783, 783, 783, 783, 850, 783, 0, 0, 797, 797, 797, 797, 0, 797, 797, 0, 10, 11, 0, 0, 0,
  /* 2795 */ 783, 783, 840, 783, 783, 783, 783, 883, 783, 783, 783, 783, 783, 783, 783, 783, 783, 15, 783, 783, 783,
  /* 2816 */ 918, 783, 783, 828, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 0, 0, 0, 0, 15,
  /* 2839 */ 783, 0, 0, 51, 1588, 89, 92, 0, 0, 0, 0, 783, 783, 783, 783, 783, 783, 783, 783, 783, 875, 783, 878, 783,
  /* 2863 */ 783, 783, 783, 783, 869, 870, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 883, 783, 15, 783,
  /* 2884 */ 783, 783, 783, 898, 783, 783, 783, 783, 783, 783, 783, 901, 783, 829, 783, 783, 783, 783, 783, 783, 783,
  /* 2905 */ 783, 783, 847, 783, 783, 783, 0, 0, 51, 1588, 10, 11, 0, 0, 0, 1082, 783, 783, 783, 783, 839, 783, 15, 783,
  /* 2929 */ 783, 783, 783, 783, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3111, 3111, 0, 10, 11, 0, 0, 0, 0, 0, 903, 783, 783, 783,
  /* 2956 */ 783, 783, 783, 783, 783, 783, 0, 0, 0, 0, 783, 783, 896, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783,
  /* 2979 */ 783, 783, 902, 911, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 884, 0, 798,
  /* 3001 */ 798, 798, 798, 0, 798, 798, 0, 10, 11, 0, 0, 0, 783, 783, 912, 783, 783, 783, 783, 783, 783, 783, 783, 783,
  /* 3025 */ 783, 783, 783, 783, 882, 783, 783, 0, 799, 799, 799, 799, 0, 799, 799, 0, 10, 11, 0, 0, 0, 783, 783, 1039,
  /* 3049 */ 905, 783, 783, 783, 783, 783, 909, 90, 10, 93, 11, 783, 783, 783, 783, 835, 783, 783, 840, 783, 783, 783,
  /* 3071 */ 783, 849, 783, 783, 0, 0, 846, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 51, 1588, 10, 11, 0, 0, 0, 0, 863,
  /* 3101 */ 783, 783, 783, 783, 783, 15, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 851, 783, 783, 783,
  /* 3122 */ 919, 0, 0, 51, 1588, 90, 93, 0, 0, 0, 0, 783, 783, 783, 783, 783, 783, 783, 783, 866, 783, 0, 0, 0, 0, 783,
  /* 3148 */ 783, 0, 0, 11776, 11776, 11776, 0, 11776, 11776, 0, 10, 11, 0, 0, 0, 0, 0, 51, 1588, 10, 11, 0, 0, 0, 1082,
  /* 3173 */ 783, 783, 783, 783, 783, 783, 783, 783, 783, 783, 845, 783, 783, 783, 783, 0
];

web_c.EXPECTED =
[
  /*   0 */ 19, 23, 27, 37, 44, 40, 51, 47, 53, 57, 66, 30, 61, 66, 33, 66, 66, 65, 70, 74, 78, 99, 82, 126, 124, 122,
  /*  26 */ 114, 86, 90, 94, 144, 144, 135, 144, 144, 151, 149, 104, 100, 111, 126, 97, 100, 111, 126, 125, 126, 123,
  /*  48 */ 126, 118, 120, 126, 122, 126, 126, 126, 126, 126, 127, 107, 131, 145, 139, 143, 144, 155, 144, 144, 144,
  /*  69 */ 144, 150, 144, 150, 144, 48, 16396, 8929420, 8929422, 11026572, 1514471936, -1514471986, -50, 8, 8, 4, 12,
  /*  86 */ 8388608, 4, 1342177280, 0, 256, 1024, 12288, 131072, 1572864, 25165824, 67108864, 536870912, 0, 32, 8, 8, 8,
  /* 103 */ 8, 1879048192, 0, 32, 32, 8736, 8736, 8800, 8, 8, 12, 4, 4, 4, 524288, 4, 4, 8, 8, 4, 4, 4, 12, 4, 4, 4, 4,
  /* 130 */ 0, 14, 16369, 16383, 0, 512, 0, 12, 0, 16, 256, 6144, 0, 28, 0, 0, 0, 0, 1, 16, 0, 0, 0, 512, 0, 512, 0, 0,
  /* 158 */ 0
];

web_c.TOKEN =
[
  "(0)",
  "EOF",
  "Identifier",
  "Literal",
  "WhiteSpace",
  "Comment",
  "';'",
  "'!'",
  "'!='",
  "'%'",
  "'%='",
  "'&'",
  "'&&'",
  "'&='",
  "'('",
  "')'",
  "'*'",
  "'*='",
  "'+'",
  "'++'",
  "'+='",
  "','",
  "'-'",
  "'--'",
  "'-='",
  "'/'",
  "'/='",
  "'<'",
  "'<<'",
  "'<<='",
  "'<='",
  "'='",
  "'=='",
  "'>'",
  "'>='",
  "'>>'",
  "'>>='",
  "'['",
  "']'",
  "'^'",
  "'^='",
  "'sizeof'",
  "'|'",
  "'|='",
  "'||'",
  "'~'"
];

// main program for use with node.js, rhino, or jrunscript

function main(args)
{
  if (typeof process !== "undefined")   // assume node.js
  {
    var command = "node";
    var arguments = process.argv.slice(2);
    var log = function(string) {process.stdout.write(string);};
    var fs = require("fs");
    var readTextFile = fs.readFileSync;
  }
  else                                  // assume rhino or jrunscript
  {
    var arguments = function()
                    {
                      var strings = [];
                      for (var i = 0; i < args.length; ++i)
                      {
                        strings[i] = String(args[i]);
                      }
                      return strings;
                    }();

    if (typeof println == "undefined")  // assume rhino
    {
      var command = "java -jar js.jar";
      var log = function(string) {java.lang.System.out.write(java.lang.String(string).getBytes("utf-8"));};
      var readTextFile = readFile;
    }
    else                                // assume jrunscript
    {
      var command = "jrunscript";
      var log = function(string) {java.lang.System.out.print(string);};
      var readTextFile = function(filename, encoding)
                         {
                           var file = new java.io.File(filename);
                           var buffer = javaByteArray(file.length());
                           new java.io.FileInputStream(file).read(buffer);
                           return String(new java.lang.String(buffer, encoding));
                         };
    }
  }

  function read(input)
  {
    if (/^{.*}$/.test(input))
    {
      return input.substring(1, input.length - 1);
    }
    else
    {
      var content = readTextFile(input, "utf-8");
      return content.length > 0 && content.charCodeAt(0) == 0xFEFF
           ? content.substring(1)
           : content;
    }
  }

  if (arguments.length == 0)
  {
    log("Usage: " + command + " web_c.js [-i] INPUT...\n");
    log("\n");
    log("  parse INPUT, which is either a filename or literal text enclosed in curly braces\n");
    log("\n");
    log("  Option:\n");
    log("    -i     indented parse tree\n");
  }
  else
  {
    var indent = false;
    for (var i = 0; i < arguments.length; ++i)
    {
      if (arguments[i] === "-i")
      {
        indent = true;
        continue;
      }
      var input = read(String(arguments[i]));
      var s = new web_c.XmlSerializer(log, indent);
      var parser = new web_c(input, s);
      try
      {
        parser.parse_Program();
      }
      catch (pe)
      {
        if (! (pe instanceof parser.ParseException))
        {
          throw pe;
        }
        else
        {
          throw parser.getErrorMessage(pe);
        }
      }
    }
  }
}

main(arguments);

// End
