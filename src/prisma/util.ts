import { Players, Prisma } from ".prisma/client";
import { PaginatedResponse, PaginationConfig } from "@/types/pagination";
import { isObjectId } from "@/util/server";
import StringFilter = Prisma.StringFilter;

export const contains = (
  str: string,
  insensitive: boolean = true
): StringFilter<any> => {
  return {
    contains: str,
    mode: insensitive ? "insensitive" : "default",
  };
};

export function escapeRegExp(string: string) {
  if (!string) return string;
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export const rawAggregateContains = (
  str: string,
  insensitive: boolean = true
): any => {
  return {
    $regex: escapeRegExp(str),
    ...(insensitive && { $options: "i" }),
  };
};
export const startsWith = (
  str: string,
  insensitive: boolean = true
): StringFilter<any> => {
  return {
    startsWith: str,
    mode: insensitive ? "insensitive" : "default",
  };
};

export const endsWith = (
  str: string,
  insensitive: boolean = true
): StringFilter<any> => {
  return {
    endsWith: str,
    mode: insensitive ? "insensitive" : "default",
  };
};

export const paginate = (
  pagination: PaginationConfig
): { skip: number; take: number } => {
  const { page, limit } = pagination;
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
};

export const paginateAggregate = (pagination: PaginationConfig): any => {
  const { page, limit } = pagination;
  return [
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit || 10,
    },
  ];
};

export const paginatedQuery = async (
  collection: typeof prisma.players | typeof prisma.matches,
  query: any,
  pagination: PaginationConfig,
  extraSearch?: any
) => {
  const aggregate = {
    pipeline: [
      {
        $facet: {
          search: [
            {
              $match: query,
            },
            ...(extraSearch ? [extraSearch] : []),
            ...paginateAggregate(pagination),
          ],
          size: [
            {
              $match: query,
            },
            {
              $count: "count",
            },
          ],
        },
      },
    ],
  };
  const data = await collection.aggregateRaw(aggregate);
  const fixed = fixJson(data);
  const d0 = fixed[0];
  const { search, size } = d0;
  const count = (size && size.length >= 1 && size[0].count) || 0;
  return {
    data: search,
    maxSize: count,
  } as PaginatedResponse<Players[]>;
};

const eJsonValuesToMoveUp = ["$oid", "$date"];
export const fixJson = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => fixJson(item));
  } else if (obj !== null && typeof obj === "object") {
    /*
    if ("$oid" in obj) {
      return obj["$oid"];
    } else if ("$date" in obj) {
      return obj["$date"];
    }
     */
    for (const value of eJsonValuesToMoveUp) {
      if (value in obj) {
        return obj[value];
      }
    }
    const updatedObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (key === "_id") {
          updatedObj["id"] = fixJson(value);
        } else {
          updatedObj[key] = fixJson(value);
        }
      }
    }
    return updatedObj;
  } else {
    return obj;
  }
};

export const toObjectId = (oid: string): any => {
  if (!isObjectId(oid)) return oid;
  return {
    $oid: oid,
  };
};
